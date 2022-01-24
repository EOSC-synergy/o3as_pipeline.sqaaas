import { Typography } from "@mui/material"
import Chart from "react-apexcharts"
import { q25, q75, median } from "../services/math/math"

const APEXCHART_PLOT_TYPE = {
    tco3_zm: "line",
    tco3_return: "boxPlot"
    // vrom3?
}

// TODO extract to constants ?
const ANTARCTIC = "Antarctic(Oct)"
const SH_MID = "SH mid-lat"
const NH_MID = "NH mid-lat"
const TROPICS = "Tropics"
const ARCTIC = "Arctic(Mar)"
const NEAR_GLOBAL = "Near global"
const GLOBAL = "Global"
const USER_REGION = "User region"
const ALL = [ANTARCTIC, SH_MID, NH_MID, TROPICS, ARCTIC, NEAR_GLOBAL, GLOBAL, USER_REGION];


export const preTransformApiData = ({plotId, data}) => {
    if (plotId === "tco3_zm" || plotId === "tco3_return") {
        const lookUpTable = {};
        for (let datum of data) {
            // top structure
            lookUpTable[datum.model] = {
                plotStyle: datum.plotstyle,
                data: [] 
            };

            // fill data
            for (let index in datum.x) {
                lookUpTable[datum.model].data.push({
                    x: datum.x[index],
                    y: datum.y[index],
                });
            }
        }
        return lookUpTable;
    };
}

/**
 * This function renders the correct apexcharts element, depending on the passed
 * plotId.
 * 
 * @param {string} obj.plotId specifies what plot should be rendered
 * @param {array} obj.series stores the data for the chart in the format that is expected by apexcharts
 * @param {object} obj.options holds the information about the graph (has to be the format that is expected by apexcharts)
 * @returns 
 */
export function renderChartWithSettings({plotId, series, options}) {
    if (typeof APEXCHART_PLOT_TYPE[plotId] === "undefined") {
        return <Typography>{`A plot for "${plotId} is currently not supported."`}</Typography>
    }
    return <Chart options={options} series={series} type={APEXCHART_PLOT_TYPE[plotId]} height={"400p"}/>
}

function calculateBoxPlotValues(data) {
    const staticData = {}
	for (let region of ALL) {
		staticData[region] = []
	}

    for (const [model, modelData] of Object.entries(data)) {

        for (let xypair of modelData.data) {
            
            staticData[xypair.x].push(xypair.y);
        }

    }
    //console.log(staticData)

    const boxPlotValues = {}
	for (let region of ALL) {
		staticData[region].sort()
		const arr = staticData[region]
		boxPlotValues[region] = []
		boxPlotValues[region].push(
			arr[0],
			q25(arr),
			median(arr),
			q75(arr),
			arr[arr.length - 1]
		)
	}
    //console.log(boxPlotValues)
    return boxPlotValues
}

export function generateSeries({plotId, data}) {
    // return color, line width, dash array if lineplot
    // else: 
    const series = [];
    const colors = [];
    if (plotId === "tco3_zm") {
        for (const [model, modelData] of Object.entries(data)) {
            series.push({
                //type: "line",
                name: model,
                data: modelData.data,
            });
            colors.push(
                colourNameToHex(modelData.plotStyle.color)
            )

        }
    } else if (plotId === "tco3_return") {
        const boxPlotValues = calculateBoxPlotValues(data);
        series.push({
                name: 'box',
                type: 'boxPlot',
        
                data: [
                {
                    x: ANTARCTIC,
                    y: boxPlotValues[ANTARCTIC] // min, q1, median, q3, max
                },
                
                {
                    x: SH_MID,
                    y: boxPlotValues[SH_MID] // all sh mid lat values etc.
                },
                {
                    x: NH_MID,
                    y: boxPlotValues[NH_MID] // all sh mid lat values etc.
                },
                {
                    x: TROPICS,
                    y: boxPlotValues[TROPICS]
                },
                {
                    x: ARCTIC,
                    y: boxPlotValues[ARCTIC]
                },
                {
                    x: NEAR_GLOBAL,
                    y: boxPlotValues[NEAR_GLOBAL]
                },
                {
                    x: GLOBAL,
                    y: boxPlotValues[GLOBAL]
                },
                {
                    x: USER_REGION,
                    y: boxPlotValues[USER_REGION],
                },
                ]
            }
        )


        for (const [model, modelData] of Object.entries(data)) {
            series.push({
                name: model,
                data: modelData.data,
                type: "scatter",
            });
            colors.push(
                colourNameToHex(modelData.plotStyle.color)
            )
        }
    }
    return {series, colors};
}
let c = 0;
export function getOptions({plotId, colors}) {
    console.log(c)
    if (plotId === "tco3_zm") {
        console.log("tco3_zm_opt")
        return Object.assign({}, {
            chart: {
                id: "penis" + c++,
                animations: {
                    enabled: false,
                    easing: "linear"
                },
                toolbar: {
                    "show": true,
                    "tools":{
                        "download": true 
                    }
                },
                zoom: {
                    enabled: true,
                    type: "xy",
                }
            },
            legend: {
                show: true,
            },
            dataLabels: {
                enabled: false,
            },
            tooltip: {
                enabled: true,
                shared: false,
            },
            colors: colors, // TODO
            stroke: {
                curve: "smooth",
                //width: [], // TODO
                //dashArray: [] // TODO
            },
            title: {
                text: "OCTS Plot", // todo
                align: "center",
                floating: false,
                style: {
                    fontSize:  "30px",
                    fontWeight:  "bold",
                    fontFamily:  "undefined",
                    color:  "#263238"
                }
            },
            /*markers: {

            }*/
        });
        
    } else if (plotId === "tco3_return") {
        console.log("tco3_return_opt")
        return Object.assign({}, {
            xaxis: {
                //type: "category", // remove if it doenst work
            },
            chart: {
              id: "tco3_return" + c++,
              type: 'boxPlot',
              height: 350,
              animations: {
                  enabled: false, // disable animations
              },
              zoom: {
                  enabled: true,
                  type: 'xy',
              }
            },
            colors: ['#008FFB', ...colors], // todo
            title: {
              text: 'TCO RETURN',
              align: 'center'
            },
            tooltip: {
              shared: false,
              intersect: true
            },
            plotOptions: {
              boxPlot: {
                colors: {
                  upper: '#5C4742',
                  lower: '#A5978B'
                }
              }
            },
            legend: {
                show: true,
            },
            
            markers: {
              size: 5,
              colors: [undefined, ...colors],
              strokeColors: '#fff',
              strokeWidth: 0,
              strokeOpacity: 0.2, //?
              strokeDashArray: 0, //?
              fillOpacity: 0.7,
              discrete: [],
              //shape: [undefined, "circle", "square"], // circle or square
              radius: 1,
              offsetX: 0, // interesting
              offsetY: 0,
              //onClick: (event) => {alert("click")},
              onDblClick: undefined,
              showNullDataPoints: true,
              hover: {
                  size: 10,
                    sizeOffset: 10,
              },
            }
            
        });
    }    
}


export function mergeModelDataAndSettings(modelData, modelSettings) {
    
};

export function formatDataBasedOnPlotId(data, plotId) {
    if (plotId === "tco3_zm") {
        const xAxis = [...Array(141).keys()].map(value => `${value + 1960}`) // 1960 - 2100 //modelData[0].x.map(string => string.substring(0,4)) // turn to years only
        //console.log(modelData)
        // transform time series of each model obj
        const ySeries = data.map(modelObj => {        
                return {
                    name: modelObj.model,
                    data: modelObj.y.map(number => number.toFixed(2)),
                }
            }
        );
        const colors = data.map(modelObj => colourNameToHex(modelObj.plotstyle.color))
        const strokes = data.map(modelObj => convertToStrokeStyle(modelObj.plotstyle.linestyle))
        const lineWidth = data.map(el => 2) // default is 2
        
        return {
            xAxis,
            ySeries,
            colors,
            strokes,
            lineWidth,
        };
    };
};

export function colourNameToHex(colour)
{
    const colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

    if (typeof colours[colour.toLowerCase()] != 'undefined')
        return colours[colour.toLowerCase()];

    return false;
};

export function convertToStrokeStyle(apiStyle) {
    const styles = {
        "solid": 0,
        "dotted": 1,
        "dashed": 3,
    };

    if (typeof styles[apiStyle.toLowerCase()] != 'undefined')
        return styles[apiStyle.toLowerCase()];
    return false;
};