define(["qlik", "jquery", "./props", "text!./styles.css"
], function (qlik, $, props, css) {

    'use strict';

    var vsettings = {};
    var qext;

    $.ajax({
        url: '../extensions/ext-balancesheet/ext-balancesheet.qext',
        dataType: 'json',
        async: false,  // wait for this call to finish.
        success: function (data) { qext = data; }
    });

    $("<style>").html(css).appendTo("head");

    return {
        initialProperties: {
            showTitles: false,
            disableNavMenu: false,
            // qHyperCubeDef: {
            //     qInitialDataFetch: [{
            //         qWidth: 5,
            //         qHeight: Math.floor(10000 / 5) // divide 10000 by qWidt
            //     }],
            //     qMeasures: JSON.parse(initialProps).qHyperCubeDef.qMeasures
            // }
        },

        definition: {
            type: "items",
            component: "accordion",
            items: [
                {
                    uses: "settings"
                }, /*{
                    uses: "dimensions",
                    min: 0,
                    max: 1
                }, {
                    uses: "measures",
                    min: 0,
                    max: 4
                },*/
                props.section1('Extension settings'),
                props.about('About this extension', qext)
            ]
        },
        support: {
            snapshot: true,
            export: true,
            exportData: true
        },


        paint: function ($element, layout) {


            var self = this;
            const ownId = this.options.id;
            const mode = qlik.navigation.getMode();
            // if (layout.pConsoleLog) console.log(ownId, 'paint', 'mode ' + mode, 'layout', layout);
            const app = qlik.currApp(this);
            const thisSheetId = qlik.navigation.getCurrentSheetId().sheetId;
            const enigma = app.model.enigmaModel;

            const biggest = layout.pFixedAssets + layout.pCurrentAssets;

            $element.html(`
            <div id="${ownId}_parent" class="bsh-parent">
                <div class="bsh-header-row">
                    <div class="bsh-header-cell">${layout.pAssetsLabel}</div>
                    <div class="bsh-spacer-width  bsh-spacer-width1"></div>
                    <div class="bsh-spacer-width"></div>
                    <div class="bsh-header-cell">${layout.pLiabilitiesLabel}</div>
                </div>
                <div class="bsh-spacer-row  bsh-spacer-row1">
                    <div class="bsh-spacer-row-cell  bsh-spacer-row-cell1"></div>
                    <div class="bsh-spacer-row-cell"></div>
                </div>
                <div class="bsh-spacer-row">
                    <div class="bsh-spacer-row-cell  bsh-spacer-row-cell1"></div>
                    <div class="bsh-spacer-row-cell"></div>
                </div>
                <div class="bsh-body-row">
                <div class="bsh-body-cell  bsh-body-cell-asst">
                    <div class="bsh-innerbox  bsh-fa" title="${layout.pFixedAssets}">
                        ${layout.pFixedAssetsLabel}
                    </div>
                    <div class="bsh-inner-spacer"></div>
                    <div class="bsh-innerbox  bsh-ca" title="${layout.pCurrentAssets}">
                        ${layout.pCurrentAssetsLabel}
                    </div>
                </div>
                <div class="bsh-spacer-width  bsh-spacer-width1"></div>
                <div class="bsh-spacer-width"></div>
                <div class="bsh-body-cell  bsh-body-cell-liab">
                    <div class="bsh-innerbox  bsh-pa" title="${layout.pPayables}">
                        ${layout.pPayablesLabel}
                    </div>
                    <div class="bsh-inner-spacer"></div>
                    <div class="bsh-innerbox  bsh-eq" title="${layout.pEquity}">
                        ${layout.pEquityLabel}
                    </div>
                </div>
                </div>
            </div> 
            `);

            const divHeight = $(`#${ownId}_parent`).parent().height() - $(`#${ownId}_parent .bsh-header-cell`).height() - 20;
            const maxY = Math.max(
                layout.pFixedAssets + layout.pCurrentAssets,
                layout.pPayables + layout.pEquity,
                Math.abs(layout.pFixedAssets), Math.abs(layout.pCurrentAssets), Math.abs(layout.pPayables), Math.abs(layout.pEquity)
            );


            $(`#${ownId}_parent`).parent().css('background-color', layout.pColorBg);

            $(`#${ownId}_parent .bsh-fa`).css({
                "height": `${divHeight * Math.abs(layout.pFixedAssets) / maxY}px`,
                "line-height": `${divHeight * Math.abs(layout.pFixedAssets) / maxY}px`
            });
            $(`#${ownId}_parent .bsh-ca`).css({
                "height": `${divHeight * Math.abs(layout.pCurrentAssets) / maxY}px`,
                "line-height": `${divHeight * Math.abs(layout.pCurrentAssets) / maxY}px`
            });
            $(`#${ownId}_parent .bsh-pa`).css({
                "height": `${divHeight * Math.abs(layout.pPayables) / maxY}px`,
                "line-height": `${divHeight * Math.abs(layout.pPayables) / maxY}px`
            });
            $(`#${ownId}_parent .bsh-eq`).css({
                "height": `${divHeight * Math.abs(layout.pEquity) / maxY}px`,
                "line-height": `${divHeight * Math.abs(layout.pEquity) / maxY}px`
            });

            // Align divs left-to-right by adding a class if there is a negative value

            if (layout.pFixedAssets < 0 || layout.pCurrentAssets < 0) {
                $(`#${ownId}_parent .bsh-body-cell-asst`).addClass('bsh-boxes-ltr');
            }
            if (layout.pPayables < 0 || layout.pEquity < 0) {
                $(`#${ownId}_parent .bsh-body-cell-liab`).addClass('bsh-boxes-ltr');
            }

            function setBgColors() {
                $(`#${ownId}_parent .bsh-fa`).css('background-color', layout.pFixedAssets < 0 ? layout.pColorNegative : layout.pColorPositive);
                $(`#${ownId}_parent .bsh-ca`).css('background-color', layout.pCurrentAssets < 0 ? layout.pColorNegative : layout.pColorPositive);
                $(`#${ownId}_parent .bsh-pa`).css('background-color', layout.pPayables < 0 ? layout.pColorNegative : layout.pColorPositive);
                $(`#${ownId}_parent .bsh-eq`).css('background-color', layout.pEquity < 0 ? layout.pColorNegative : layout.pColorPositive);
                if (layout.pVarName) {
                    app.variable.getContent(layout.pVarName, function (varVal) {
                        switch (varVal.qContent.qString) {
                            case layout.pFixedAssetsVar:
                                $(`#${ownId}_parent .bsh-fa`).css('background-color', layout.pFixedAssets < 0 ? layout.pColorNegativeSel : layout.pColorPositiveSel);
                                break;
                            case layout.pCurrentAssetsVar:
                                $(`#${ownId}_parent .bsh-ca`).css('background-color', layout.pCurrentAssets < 0 ? layout.pColorNegativeSel : layout.pColorPositiveSel);
                                break;
                            case layout.pPayablesVar:
                                $(`#${ownId}_parent .bsh-pa`).css('background-color', layout.pPayables < 0 ? layout.pColorNegativeSel : layout.pColorPositiveSel);
                                break;
                            case layout.pEquityVar:
                                $(`#${ownId}_parent .bsh-eq`).css('background-color', layout.pEquity < 0 ? layout.pColorNegativeSel : layout.pColorPositiveSel);
                                break;
                        }
                    })
                }
            }

            setBgColors();

            if (layout.pVarName) {
                $(`#${ownId}_parent .bsh-fa`).css('cursor', 'pointer').click(() => {
                    app.variable.getContent(layout.pVarName, function (varVal) {
                        const newVal = varVal.qContent.qString == layout.pFixedAssetsVar ? layout.pVarNameDefaultVal : layout.pFixedAssetsVar;
                        app.variable.setStringValue(layout.pVarName, newVal).then(() => setBgColors());
                    })
                })

                $(`#${ownId}_parent .bsh-ca`).css('cursor', 'pointer').click(() => {
                    app.variable.getContent(layout.pVarName, function (varVal) {
                        const newVal = varVal.qContent.qString == layout.pCurrentAssetsVar ? layout.pVarNameDefaultVal : layout.pCurrentAssetsVar;
                        app.variable.setStringValue(layout.pVarName, newVal).then(() => setBgColors());
                    })
                })

                $(`#${ownId}_parent .bsh-pa`).css('cursor', 'pointer').click(() => {
                    app.variable.getContent(layout.pVarName, function (varVal) {
                        const newVal = varVal.qContent.qString == layout.pPayablesVar ? layout.pVarNameDefaultVal : layout.pPayablesVar;
                        app.variable.setStringValue(layout.pVarName, newVal).then(() => setBgColors());
                    })
                })

                $(`#${ownId}_parent .bsh-eq`).css('cursor', 'pointer').click(() => {
                    app.variable.getContent(layout.pVarName, function (varVal) {
                        const newVal = varVal.qContent.qString == layout.pEquityVar ? layout.pVarNameDefaultVal : layout.pEquityVar;
                        app.variable.setStringValue(layout.pVarName, newVal).then(() => setBgColors());
                    })
                })
            }

            return qlik.Promise.resolve();
        }
    }
});