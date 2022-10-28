define(["jquery"], function ($) {

    return {

        section1: function (title) {
            return {
                label: title,
                type: 'items',
                items: [
                    {
                        label: "Qlik Variable to set",
                        type: "string",
                        expression: 'optional',
                        ref: "pVarName",
                    }, {
                        label: "Default Variable value",
                        type: "string",
                        expression: 'optional',
                        ref: "pVarNameDefaultVal",
                        defaultValue: '*',
                    },

                    subSection('Assets', [
                        {
                            label: "Label for Assets",
                            type: 'string',
                            expression: 'optional',
                            ref: 'pAssetsLabel',
                            defaultValue: 'AKTIVA',
                            // show: function (arg) { return !useTestData(arg) }
                        }, {
                            label: "Label for Fixed Assets",
                            type: 'string',
                            expression: 'optional',
                            ref: 'pFixedAssetsLabel',
                            defaultValue: 'Anlagevermögen',
                            // show: function (arg) { return !useTestData(arg) }
                        }, {
                            label: "Value for Fixed Assets",
                            type: 'number',
                            expression: 'optional',
                            ref: 'pFixedAssets',
                            defaultValue: 2000
                        }, {
                            label: "Set variable to value",
                            type: 'string',
                            expression: 'optional',
                            ref: 'pFixedAssetsVar',
                            defaultValue: '*Anlagever*'
                        }, {
                            label: "",
                            component: "text"
                        }, {
                            label: "Label for Current Assets",
                            type: 'string',
                            expression: 'optional',
                            ref: 'pCurrentAssetsLabel',
                            defaultValue: 'Umlaufvermögen'
                        }, {
                            label: "Value for Current Assets",
                            type: 'number',
                            expression: 'optional',
                            ref: 'pCurrentAssets',
                            defaultValue: 3000
                        }, {
                            label: "Set variable to value",
                            type: 'string',
                            expression: 'optional',
                            ref: 'pCurrentAssetsVar',
                            defaultValue: '*Umlaufverm*'
                        }
                    ]),
                    subSection('Liabilities', [
                        {
                            label: "Label for Liabilities",
                            type: 'string',
                            expression: 'optional',
                            ref: 'pLiabilitiesLabel',
                            defaultValue: 'PASSIVA',
                            // show: function (arg) { return !useTestData(arg) }
                        }, {
                            label: "Label for Payables",
                            type: 'string',
                            expression: 'optional',
                            ref: 'pPayablesLabel',
                            defaultValue: 'Verbindlichkeiten',
                            // show: function (arg) { return !useTestData(arg) }
                        }, {
                            label: "Value for Payables",
                            type: 'number',
                            expression: 'optional',
                            ref: 'pPayables',
                            defaultValue: 1000,
                            // show: function (arg) { return !useTestData(arg) }
                        }, {
                            label: "Set variable to value",
                            type: 'string',
                            expression: 'optional',
                            ref: 'pPayablesVar',
                            defaultValue: '*Verbindl*'
                        }, {
                            label: "",
                            component: "text"
                        }, {
                            label: "Label for Equity",
                            type: 'string',
                            expression: 'optional',
                            ref: 'pEquityLabel',
                            defaultValue: 'Eigenkapital',
                            // show: function (arg) { return !useTestData(arg) }
                        }, {
                            label: "Value for Equity",
                            type: 'number',
                            expression: 'optional',
                            ref: 'pEquity',
                            defaultValue: 4000,
                            // show: function (arg) { return !useTestData(arg) }
                        }, {
                            label: "Set variable to value",
                            type: 'string',
                            expression: 'optional',
                            ref: 'pEquityVar',
                            defaultValue: '*Eigenkap*'
                        }
                    ]),
                    subSection('Colors', [
                        {
                            label: "Color for positive values",
                            type: 'string',
                            expression: 'optional',
                            ref: 'pColorPositive',
                            defaultValue: '#ebede5'
                        }, {
                            label: "Color for selected positive values",
                            type: 'string',
                            expression: 'optional',
                            ref: 'pColorPositiveSel',
                            defaultValue: '#d6dbcb'
                        }, {
                            label: "Color for negative values",
                            type: 'string',
                            expression: 'optional',
                            ref: 'pColorNegative',
                            defaultValue: '#ffeedd'
                        }, {
                            label: "Color for selected negative values",
                            type: 'string',
                            expression: 'optional',
                            ref: 'pColorNegativeSel',
                            defaultValue: '#f9d7b5'
                        }, {
                            label: "Color for background",
                            type: 'string',
                            expression: 'optional',
                            ref: 'pColorBg',
                            defaultValue: '#eeeeee',
                            // show: function (arg) { return !useTestData(arg) }
                        }
                    ]), {
                        type: "boolean",
                        defaultValue: false,
                        ref: "pConsoleLog",
                        label: "console.log debugging info"
                    }
                ]
            }
        },

        about: function (title, qext) {
            return {
                label: title,
                type: 'items',
                items: [
                    {
                        label: function (arg) { return 'Installed extension version ' + qext.version },
                        component: "link",
                        url: '../extensions/ext-echart-linearity/ext-ext-balancesheetqext'
                    }, {
                        label: "This extension is free of charge by data/\\bridge, Qlik OEM partner and specialist for Mashup integrations.",
                        component: "text"
                    }, {
                        label: "Use as is. No support without a maintenance subscription.",
                        component: "text"
                    }, {
                        label: "",
                        component: "text"
                    }, {
                        label: "About Us",
                        component: "link",
                        url: 'https://www.databridge.ch'
                    }, {
                        label: "Open Documentation",
                        component: "button",
                        action: function (arg) {
                            window.open('https://github.com/ChristofSchwarz/qs-ext-echart-linearity/blob/main/README.md', '_blank');
                        }
                    }
                ]
            }
        }
    }

    function subSection(labelText, itemsArray, argKey, argVal) {
        var ret = {
            component: 'expandable-items',
            items: {}
        };
        var hash = 0;
        for (var j = 0; j < labelText.length; j++) {
            hash = ((hash << 5) - hash) + labelText.charCodeAt(j)
            hash |= 0;
        }
        ret.items[hash] = {
            label: labelText,
            type: 'items',
            show: function (arg) { return (argKey && argVal) ? (arg[argKey] == argVal) : true },
            items: itemsArray
        };
        return ret;
    }
});