/*
Language: Metal
Description: Metal Shading Language
Author: Based on MetalGrammar by Warren Moore
Website: https://developer.apple.com/metal/
Category: graphics
*/

/** @type LanguageFn */
export default function(hljs) {
  const regex = hljs.regex;
  
  const C_LINE_COMMENT_MODE = hljs.COMMENT('//', '$', { contains: [ { begin: /\\\n/ } ] });
  
  const DECLTYPE_AUTO_RE = 'decltype\\(auto\\)';
  const NAMESPACE_RE = '[a-zA-Z_]\\w*::';
  const TEMPLATE_ARGUMENT_RE = '<[^<>]+>';
  const FUNCTION_TYPE_RE = '(?!struct)('
    + DECLTYPE_AUTO_RE + '|'
    + regex.optional(NAMESPACE_RE)
    + '[a-zA-Z_]\\w*' + regex.optional(TEMPLATE_ARGUMENT_RE)
  + ')';

  // https://en.cppreference.com/w/cpp/language/escape
  const CHARACTER_ESCAPES = '\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)';
  
  const STRINGS = {
    className: 'string',
    variants: [
      {
        begin: '(u8?|U|L)?"',
        end: '"',
        illegal: '\\n',
        contains: [ hljs.BACKSLASH_ESCAPE ]
      },
      {
        begin: '(u8?|U|L)?\'(' + CHARACTER_ESCAPES + '|.)',
        end: '\'',
        illegal: '.'
      },
      hljs.END_SAME_AS_BEGIN({
        begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
        end: /\)([^()\\ ]{0,16})"/
      })
    ]
  };

  const NUMBERS = {
    className: 'number',
    variants: [
      // Floating-point literal with Metal-specific suffixes (h for half, f for float)
      { begin:
        "[+-]?(?:"
          + "(?:"
            +"[0-9](?:'?[0-9])*\\.(?:[0-9](?:'?[0-9])*)?"
            + "|\\.[0-9](?:'?[0-9])*"
          + ")(?:[Ee][+-]?[0-9](?:'?[0-9])*)?"
          + "|[0-9](?:'?[0-9])*[Ee][+-]?[0-9](?:'?[0-9])*"
          + "|0[Xx](?:"
            +"[0-9A-Fa-f](?:'?[0-9A-Fa-f])*(?:\\.(?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)?)?"
            + "|\\.[0-9A-Fa-f](?:'?[0-9A-Fa-f])*"
          + ")[Pp][+-]?[0-9](?:'?[0-9])*"
        + ")(?:"
          + "[Hh]"  // half suffix
          + "|[Ff]" // float suffix
          + "|"     // no suffix
        + ")"
      },
      // Integer literal
      { begin:
        "[+-]?\\b(?:"
          + "0[Bb][01](?:'?[01])*"
          + "|0[Xx][0-9A-Fa-f](?:'?[0-9A-Fa-f])*"
          + "|0(?:'?[0-7])*"
          + "|[1-9](?:'?[0-9])*"
        + ")(?:"
          + "[Uu](?:LL?|ll?)"
          + "|[Uu][Zz]?"
          + "|(?:LL?|ll?)[Uu]?"
          + "|[Zz][Uu]"
          + "|"
        + ")"
      }
    ],
    relevance: 0
  };

  const PREPROCESSOR = {
    className: 'meta',
    begin: /#\s*[a-z]+\b/,
    end: /$/,
    keywords: { keyword:
        'if else elif endif define undef warning error line '
        + 'pragma ifdef ifndef include elseif' },
    contains: [
      {
        begin: /\\\n/,
        relevance: 0
      },
      hljs.inherit(STRINGS, { className: 'string' }),
      {
        className: 'string',
        begin: /<.*?>/
      },
      C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE
    ]
  };

  // Metal-specific keywords
  const METAL_KEYWORDS = [
    'alignas', 'alignof', 'and', 'and_eq', 'asm', 'auto', 'bitand', 'bitor', 'bool', 'break', 'case',
    'catch', 'char', 'char8_t', 'char16_t', 'char32_t', 'class', 'compl', 'concept', 'const',
    'consteval', 'constexpr', 'constinit', 'const_cast', 'continue', 'decltype', 'default', 'delete',
    'do', 'double', 'dynamic_cast', 'else', 'enum', 'explicit', 'export', 'extern', 'false',
    'float', 'for', 'friend', 'goto', 'if', 'inline', 'int', 'long', 'mutable', 'namespace', 'new',
    'noexcept', 'not', 'not_eq', 'nullptr', 'operator', 'or', 'or_eq', 'private', 'protected', 'public',
    'register', 'reinterpret_cast', 'requires', 'return', 'short', 'signed', 'sizeof', 'static',
    'static_assert', 'static_cast', 'struct', 'switch', 'template', 'this',
    'throw', 'true', 'try', 'typedef', 'typeid', 'typename', 'union', 'unsigned', 'using', 'void',
    'volatile', 'wchar_t', 'while', 'xor', 'xor_eq'
  ];

  // Metal scalar types (basic types)
  const METAL_SCALAR_TYPES = [
    'bool', 'char', 'char8_t', 'char16_t', 'char32_t', 'double', 'float', 'int', 'long', 'short',
    'void', 'wchar_t', 'unsigned', 'signed', 'const', 'static',
    'uchar', 'ushort', 'uint', 'ulong', 'half', 'bfloat'
  ];

  // Metal vector types (2, 3, 4 component vectors)
  const METAL_VECTOR_TYPES = [
    // bool vectors
    'bool2', 'bool3', 'bool4',
    // char/uchar vectors
    'char2', 'char3', 'char4', 'uchar2', 'uchar3', 'uchar4',
    // short/ushort vectors
    'short2', 'short3', 'short4', 'ushort2', 'ushort3', 'ushort4',
    // int/uint vectors
    'int2', 'int3', 'int4', 'uint2', 'uint3', 'uint4',
    // long/ulong vectors
    'long2', 'long3', 'long4', 'ulong2', 'ulong3', 'ulong4',
    // half vectors
    'half2', 'half3', 'half4',
    // bfloat vectors
    'bfloat2', 'bfloat3', 'bfloat4',
    // float vectors
    'float2', 'float3', 'float4'
  ];

  // Metal matrix types
  const METAL_MATRIX_TYPES = [
    'float2x2', 'float2x3', 'float2x4',
    'float3x2', 'float3x3', 'float3x4',
    'float4x2', 'float4x3', 'float4x4',
    'half2x2', 'half2x3', 'half2x4',
    'half3x2', 'half3x3', 'half3x4',
    'half4x2', 'half4x3', 'half4x4'
  ];

  // Metal texture and sampler types
  const METAL_TEXTURE_TYPES = [
    'texture1d', 'texture1d_array', 'texture2d', 'texture2d_array', 'texture2d_ms', 'texture2d_ms_array',
    'texture3d', 'texturecube', 'texturecube_array', 'texture_buffer',
    'depth2d', 'depth2d_array', 'depth2d_ms', 'depth2d_ms_array', 'depthcube', 'depthcube_array',
    'sampler'
  ];

  // Metal address space qualifiers (keywords, not types)
  const METAL_ADDRESS_SPACE = [
    'device', 'constant', 'thread', 'threadgroup', 'threadgroup_imageblock'
  ];

  // Metal atomic types
  const METAL_SPECIAL_TYPES = [
    'atomic_int', 'atomic_uint', 'atomic_bool'
  ];

  // Metal built-in functions
  const METAL_BUILT_INS = [
    // Math functions
    'abs', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atan2', 'atanh',
    'ceil', 'clamp', 'cos', 'cosh', 'cross', 'degrees', 'distance', 'dot',
    'exp', 'exp2', 'fabs', 'floor', 'fma', 'fmod', 'fract', 'frexp',
    'inversesqrt', 'ldexp', 'length', 'log', 'log2', 'max', 'min', 'mix',
    'modf', 'normalize', 'pow', 'radians', 'reflect', 'refract', 'round',
    'rsqrt', 'saturate', 'sign', 'sin', 'sinh', 'smoothstep', 'sqrt',
    'step', 'tan', 'tanh', 'trunc',
    // Geometric functions
    'faceforward', 'determinant', 'transpose',
    // Relational functions
    'all', 'any', 'select',
    // Metal-specific functions
    'pack_float_to_snorm4x8', 'pack_float_to_unorm4x8', 'unpack_snorm4x8_to_float', 'unpack_unorm4x8_to_float',
    'pack_float_to_snorm2x16', 'pack_float_to_unorm2x16', 'unpack_snorm2x16_to_float', 'unpack_unorm2x16_to_float',
    // Atomic functions
    'atomic_compare_exchange_weak_explicit', 'atomic_exchange_explicit', 'atomic_fetch_add_explicit',
    'atomic_fetch_and_explicit', 'atomic_fetch_max_explicit', 'atomic_fetch_min_explicit',
    'atomic_fetch_or_explicit', 'atomic_fetch_sub_explicit', 'atomic_fetch_xor_explicit',
    'atomic_load_explicit', 'atomic_store_explicit',
    // Synchronization
    'threadgroup_barrier', 'simdgroup_barrier', 'mem_flags',
    // Texture sampling
    'sample', 'read', 'write', 'gather', 'gather_compare', 'sample_compare'
  ];

  // Metal attribute keywords (used in function signatures)
  const METAL_ATTRIBUTES = [
    'vertex', 'fragment', 'kernel',
    'vertex_id', 'instance_id', 'base_vertex', 'base_instance',
    'position', 'point_size', 'clip_distance', 'color',
    'front_facing', 'sample_id', 'sample_mask', 'depth',
    'stage_in', 'stage_out',
    'buffer', 'texture', 'sampler', 'threadgroup'
  ];

  const LITERALS = [
    'true',
    'false',
    'nullptr',
    'NULL'
  ];

  const METAL_TYPE_MODES = {
    className: 'type',
    begin: '\\b[a-z\\d_]*_t\\b'
  };

  // Vector type highlighting (float2, float3, int4, etc.)
  const VECTOR_TYPE = {
    className: 'type-vector',
    begin: '\\b(' + METAL_VECTOR_TYPES.join('|') + ')\\b',
    relevance: 0
  };

  // Matrix type highlighting (float3x3, float4x4, etc.)
  const MATRIX_TYPE = {
    className: 'type-matrix',
    begin: '\\b(' + METAL_MATRIX_TYPES.join('|') + ')\\b',
    relevance: 0
  };

  // Texture type highlighting
  const TEXTURE_TYPE = {
    className: 'type-texture',
    begin: '\\b(' + METAL_TEXTURE_TYPES.join('|') + ')\\b',
    relevance: 0
  };

  const TITLE_MODE = {
    className: 'title',
    begin: regex.optional(NAMESPACE_RE) + hljs.IDENT_RE,
    relevance: 0
  };

  const FUNCTION_TITLE = regex.optional(NAMESPACE_RE) + hljs.IDENT_RE + '\\s*\\(';

  const METAL_KEYWORDS_MODE = {
    keyword: METAL_KEYWORDS.concat(METAL_ADDRESS_SPACE),
    type: METAL_SCALAR_TYPES.concat(METAL_SPECIAL_TYPES),
    literal: LITERALS,
    built_in: METAL_BUILT_INS.concat(METAL_ATTRIBUTES)
  };

  // Attribute syntax [[attribute_name]]
  const ATTRIBUTE_MODE = {
    className: 'attr',
    begin: /\[\[/,
    end: /\]\]/,
    keywords: {
      attr: METAL_ATTRIBUTES
    },
    contains: [
      hljs.C_NUMBER_MODE,
      C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE
    ]
  };

  const FUNCTION_DISPATCH = {
    className: 'function.dispatch',
    relevance: 0,
    keywords: {
      _hint: METAL_BUILT_INS
    },
    begin: regex.concat(
      /\b/,
      `(?!${METAL_KEYWORDS.join('|')})`,
      hljs.IDENT_RE,
      regex.lookahead(/(<[^<>]+>|)\s*\(/))
  };

  const OPERATORS = {
    className: 'operator',
    begin: /(?<!\/)\/(?![/*])|[+\-%&|^~!=<>]=?|&&|\|\||<<|>>|\?|(?::(?!:))|(?<![/])\*(?!\/)/,
    relevance: 0
  };

  // Vector swizzle access: .xy, .rgba, .stpq (1-4 components)
  // Lookbehind for the dot so it stays unclassed punctuation.
  const SWIZZLE = {
    className: 'type-vector',
    begin: /(?<=\.)[xyzwrgbastpq]{1,4}\b/,
    relevance: 0
  };

  // Known method calls on textures/objects: .sample(, .read(, .write(, etc.
  const MEMBER_BUILTIN = {
    className: 'built_in',
    begin: /(?<=\.)(?:sample|read|write|gather|gather_compare|sample_compare|get_width|get_height|get_depth|get_num_mip_levels|get_num_samples)\s*(?=\()/,
    relevance: 0
  };

  const EXPRESSION_CONTAINS = [
    FUNCTION_DISPATCH,
    PREPROCESSOR,
    ATTRIBUTE_MODE,
    // Specific type modes must come before generic METAL_TYPE_MODES
    MATRIX_TYPE,
    VECTOR_TYPE,
    TEXTURE_TYPE,
    METAL_TYPE_MODES,
    SWIZZLE,
    MEMBER_BUILTIN,
    OPERATORS,
    C_LINE_COMMENT_MODE,
    hljs.C_BLOCK_COMMENT_MODE,
    NUMBERS,
    STRINGS
  ];

  const EXPRESSION_CONTEXT = {
    variants: [
      {
        begin: /=/,
        end: /;/
      },
      {
        begin: /\(/,
        end: /\)/
      },
      {
        beginKeywords: 'new throw return else',
        end: /;/
      }
    ],
    keywords: METAL_KEYWORDS_MODE,
    contains: EXPRESSION_CONTAINS.concat([
      {
        begin: /\(/,
        end: /\)/,
        keywords: METAL_KEYWORDS_MODE,
        contains: EXPRESSION_CONTAINS.concat([ 'self' ]),
        relevance: 0
      }
    ]),
    relevance: 0
  };

  const FUNCTION_DECLARATION = {
    className: 'function',
    begin: '(' + FUNCTION_TYPE_RE + '[\\*&\\s]+)+' + FUNCTION_TITLE,
    returnBegin: true,
    end: /[{;=]/,
    excludeEnd: true,
    keywords: METAL_KEYWORDS_MODE,
    illegal: /[^\w\s\*&:<>.]/,
    contains: [
      ATTRIBUTE_MODE,
      {
        begin: DECLTYPE_AUTO_RE,
        keywords: METAL_KEYWORDS_MODE,
        relevance: 0
      },
      {
        begin: FUNCTION_TITLE,
        returnBegin: true,
        contains: [ TITLE_MODE ],
        relevance: 0
      },
      {
        begin: /::/,
        relevance: 0
      },
      {
        begin: /:/,
        endsWithParent: true,
        contains: [
          STRINGS,
          NUMBERS
        ]
      },
      {
        relevance: 0,
        match: /,/
      },
      {
        className: 'params',
        begin: /\(/,
        end: /\)/,
        keywords: METAL_KEYWORDS_MODE,
        relevance: 0,
        contains: [
          ATTRIBUTE_MODE,
          C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          STRINGS,
          NUMBERS,
          MATRIX_TYPE,
          VECTOR_TYPE,
          TEXTURE_TYPE,
          METAL_TYPE_MODES,
          {
            begin: /\(/,
            end: /\)/,
            keywords: METAL_KEYWORDS_MODE,
            relevance: 0,
            contains: [
              'self',
              ATTRIBUTE_MODE,
              C_LINE_COMMENT_MODE,
              hljs.C_BLOCK_COMMENT_MODE,
              STRINGS,
              NUMBERS,
              MATRIX_TYPE,
              VECTOR_TYPE,
              TEXTURE_TYPE,
              METAL_TYPE_MODES
            ]
          }
        ]
      },
      MATRIX_TYPE,
      VECTOR_TYPE,
      TEXTURE_TYPE,
      METAL_TYPE_MODES,
      C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      PREPROCESSOR
    ]
  };

  return {
    name: 'Metal',
    aliases: [ 'metal' ],
    keywords: METAL_KEYWORDS_MODE,
    illegal: '</',
    classNameAliases: { 
      'function.dispatch': 'built_in'
    },
    contains: [].concat(
      EXPRESSION_CONTEXT,
      FUNCTION_DECLARATION,
      FUNCTION_DISPATCH,
      EXPRESSION_CONTAINS,
      [
        PREPROCESSOR,
        ATTRIBUTE_MODE,
        {
          begin: hljs.IDENT_RE + '::',
          keywords: METAL_KEYWORDS_MODE
        },
        {
          match: [
            /\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/,
            /\s+/,
            /\w+/
          ],
          className: {
            1: 'keyword',
            3: 'title.class'
          }
        }
      ])
  };
}

