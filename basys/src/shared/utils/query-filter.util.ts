// src/utils/filter.util.ts
export class ParamFilter {
  static applyJson(json: Record<string, any>, filters: string[]) {
    for (const key of Object.keys(json)) {
      json[key] = ParamFilter.apply(json[key], filters);
    }
    return json;
  }
  static apply(value: any, filters: string[]) {
    return filters.reduce((val, filter) => {
      switch (filter) {
        case 'trim':
          return typeof val === 'string' ? val.trim() : val;
        case 'strip_tags':
          return typeof val === 'string' ? val.replace(/<\/?[^>]+(>|$)/g, '') : val;
        case 'htmlspecialchars':
          return typeof val === 'string'
            ? val.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;')
            : val;
        default:
          return val;
      }
    }, value);
  }
}