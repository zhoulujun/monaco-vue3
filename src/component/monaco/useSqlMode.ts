import * as monaco from 'monaco-editor';
import sqlKeywords from '@/component/monaco/sqlKeywords';
import { onBeforeMount } from 'vue';

export default function useSqlMode(
  tableNames: string[],
  tableFields: Record<string, []>,
  dbName: string,
) {
  const suggestion = monaco.languages.registerCompletionItemProvider('sql', {
    // 触发条件，也可以不写，不写的话只要输入满足配置的label就会提示；仅支持单字符
    triggerCharacters: ['.', ' '],
    provideCompletionItems: (model, position) => {
      let suggestions: any[] = getSQLSuggest();
      const { lineNumber, column } = position;
      const textBeforePointer = model.getValueInRange({
        startLineNumber: lineNumber,
        startColumn: 0,
        endLineNumber: lineNumber,
        endColumn: column,
      });
      const tokens = textBeforePointer.toLocaleLowerCase().trim()
        .split(/\s+/);
      const lastToken = tokens[tokens.length - 1]; // 获取最后一段非空字符串
      if (lastToken.endsWith('.')) {
        suggestions = getTableSuggest();
      } else if (lastToken === '.') {
        suggestions = [];
      } else if (textBeforePointer.endsWith(' ')) {
        if (textBeforePointer.endsWith('select * from ')) {
          // select * from 提示指定数据库的表名
          suggestions = getTableSuggest();
        } else if (lastToken === 'where') {
          const lastToken2 = tokens[tokens.length - 2];
          const lastToken3 = tokens[tokens.length - 3];
          const lastToken4 = tokens[tokens.length - 4];
          const lastToken5 = tokens[tokens.length - 5];
          if (lastToken5 + lastToken4 + lastToken3 === 'select*from') {
            // select * from tableName where 提示指定表的字段名
            suggestions = [getParamSuggest(lastToken2)];
          }
        }
      }
      return {
        suggestions,
      };
    },
  });

  function getSQLSuggest() {
    return sqlKeywords.map(key => ({
      label: key,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: key,
      detail: 'keyword',
    }));
  }

  function getTableSuggest() {
    if (!tableNames?.length) {
      return [];
    }
    return tableNames?.map(name => ({
      label: name,
      kind: monaco.languages.CompletionItemKind.Constant,
      insertText: name,
      detail: dbName,
    }));
  }

  function getParamSuggest(tableName: string) {
    const params = tableFields?.[tableName];
    if (!params?.length) {
      return [];
    }
    return params.map(name => ({
      label: name,
      kind: monaco.languages.CompletionItemKind.Constant,
      insertText: name,
      detail: 'param',
    }));
  }

  onBeforeMount(() => {
    suggestion?.dispose?.();
  });
}

