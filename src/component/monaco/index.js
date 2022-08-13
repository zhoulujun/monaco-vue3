"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var vue_1 = require("vue");
var monaco = require("monaco-editor");
var monaco_promql_1 = require("monaco-promql");
var code_1 = require("../icons/code");
var filliscreen_line_1 = require("../icons/filliscreen-line");
var unfull_screen_1 = require("../icons/unfull-screen");
require("./index.scss");
// const monaco = await import(/* webpackPrefetch: true;" */'monaco-editor');
exports["default"] = (0, vue_1.defineComponent)({
    name: 'MonacoEditor',
    props: {
        modelValue: {
            type: String,
            "default": ''
        },
        original: {
            type: String,
            "default": ''
        },
        showToolbox: {
            type: Boolean,
            "default": true
        },
        diffEditor: {
            type: Boolean,
            "default": false
        },
        isFull: {
            type: Boolean,
            "default": false
        },
        language: {
            type: String,
            "default": 'sql'
        },
        line: {
            type: Number,
            "default": null
        },
        width: {
            type: String || Number,
            "default": '100%'
        },
        height: {
            type: String || Number,
            "default": '100%'
        },
        keywords: {
            type: Array,
            "default": 'sql'
        },
        theme: {
            type: String,
            "default": 'vs-dark'
        },
        onBeforeMount: {
            type: Function,
            "default": function () { }
        },
        options: {
            type: Object,
            "default": function () { return ({}); }
        }
    },
    emits: ['update:modelValue', 'change', 'editorMounted'],
    setup: function (props, _a) {
        var emit = _a.emit, slots = _a.slots;
        var editor;
        var dom = (0, vue_1.ref)();
        var isFull = (0, vue_1.ref)(false);
        var loading = (0, vue_1.ref)(true);
        var style = (0, vue_1.computed)(function () {
            if (isFull.value) {
                return {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 999999999,
                    width: '100%',
                    height: '100%'
                };
            }
            return {
                width: typeof props.width === 'number' ? "".concat(props.width, "px") : props.width,
                height: typeof props.height === 'number' ? "".concat(props.height, "px") : props.height
            };
        });
        function initMonaco() {
            return __awaiter(this, void 0, void 0, function () {
                var modelValue, language, theme, options, languageId_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!dom.value) {
                                console.error('monaco editor dom is null');
                                return [2 /*return*/];
                            }
                            modelValue = props.modelValue, language = props.language, theme = props.theme, options = props.options;
                            if (language === 'promql') {
                                languageId_1 = monaco_promql_1.promLanguageDefinition.id;
                                monaco.languages.register(monaco_promql_1.promLanguageDefinition);
                                monaco.languages.onLanguage(languageId_1, function () {
                                    monaco_promql_1.promLanguageDefinition.loader().then(function (mod) {
                                        var obj = mod.completionItemProvider.provideCompletionItems();
                                        var arr = __spreadArray([], obj.suggestions, true);
                                        arr = arr.map(function (ele) { return (__assign(__assign({}, ele), { detail: 'Function' })); });
                                        var list = props.keywords.map(function (keyword) { return ({ label: keyword, insertText: keyword, kind: 17, insertTextRules: 4, detail: 'Metric' }); });
                                        arr = arr.concat(list);
                                        console.log('mod.language', mod.language);
                                        monaco.languages.setMonarchTokensProvider(languageId_1, mod.language);
                                        monaco.languages.setLanguageConfiguration(languageId_1, mod.languageConfiguration);
                                        monaco.languages.registerCompletionItemProvider(languageId_1, {
                                            provideCompletionItems: function () { return ({ suggestions: arr }); }
                                        });
                                    });
                                });
                            }
                            return [4 /*yield*/, (props === null || props === void 0 ? void 0 : props.onBeforeMount(monaco, dom.value))];
                        case 1:
                            _a.sent();
                            editor = monaco.editor.create(dom.value, __assign({ value: modelValue, language: language, theme: theme }, options));
                            loading.value = false;
                            editor.onDidChangeModelContent(function () {
                                var value = editor.getValue() || '';
                                emit('update:modelValue', value);
                                emit('change', value);
                            });
                            emit('editorMounted', editor, dom.value);
                            return [2 /*return*/];
                    }
                });
            });
        }
        function format() {
            // editor?.getAction('editor.action.formatDocument')
            // @ts-ignore
            editor === null || editor === void 0 ? void 0 : editor.trigger('anyString', 'editor.action.formatDocument');
            // editor?.setValue(editor?.getValue())
        }
        (0, vue_1.onMounted)(function () {
            initMonaco();
        });
        (0, vue_1.onUnmounted)(function () {
            editor === null || editor === void 0 ? void 0 : editor.dispose();
            editor = null;
        });
        (0, vue_1.watch)(function () { return props.modelValue; }, function (newVal) {
            if (editor && newVal !== editor.getValue()) {
                editor.setValue(newVal);
            }
        });
        (0, vue_1.watch)(function () { return props.language; }, function (language) {
            if (language && editor) {
                var model = editor.getModel();
                model && monaco.editor.setModelLanguage(model, language);
            }
        });
        (0, vue_1.watch)(function () { return props.theme; }, function (theme) {
            if (theme && editor) {
                monaco.editor.setTheme(theme);
            }
        });
        (0, vue_1.watch)(function () { return props.line; }, function (line) {
            line && (editor === null || editor === void 0 ? void 0 : editor.revealLine(line));
        });
        function fullScreen() {
            isFull.value = !isFull.value;
            (0, vue_1.nextTick)(function () {
                debugger;
                editor === null || editor === void 0 ? void 0 : editor.layout();
            });
        }
        function toolsRender() {
            if (!props.showToolbox) {
                return null;
            }
            if (slots === null || slots === void 0 ? void 0 : slots.tools) {
                return slots === null || slots === void 0 ? void 0 : slots.tools(editor);
            }
            return (<div class='monaco-editor-toolbox'>
                    <div class='tools-item' onClick={format}>
                        <code_1["default"] />
                    </div>
                    <div class='tools-item' onClick={fullScreen}>
                        {isFull.value ? <unfull_screen_1["default"] /> : <filliscreen_line_1["default"] />}
                    </div>
                </div>);
        }
        return {
            style: style,
            toolsRender: toolsRender,
            dom: dom,
            loading: loading
        };
    },
    render: function () {
        var _a, _b, _c;
        return (<div class='monaco-editor-wrap monaco-editor' style={this.style}>
                {this.loading ? (_c = (_b = (_a = this.$slots).loading) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : '' : ''}
                {this.toolsRender()}

                <div ref='dom' class='monaco-editor-content'/>
            </div>);
    }
});
