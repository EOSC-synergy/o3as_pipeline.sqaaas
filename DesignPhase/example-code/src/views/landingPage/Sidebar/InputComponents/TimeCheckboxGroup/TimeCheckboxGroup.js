import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { selectCurrentPlotType, setMonths } from "../../../../../store/plotSlice";
import SeasonCheckBoxGroup from "./SeasonCheckboxGroup/SeasonCheckBoxGroup";

/**
 * enables the user to select a month, season or the whole year
 * @param {*} props 
 *  props.defaultTimeSelection -> the default months that should be selected
 * @returns a jsx containing a checkboxgroup per season and a "all year" checkbox
 */
export default function TimeCheckBoxGroup(props) {
    
    props.error;
    const dispatch = useDispatch()


    const sesaons = [
        {
            name: 'Spring',
            months: [3, 4, 5]
        },
        {
            name: 'Summer',
            months: [6, 7, 8]
        },
        {
            name: 'Fall',
            months: [9, 10, 11]
        },
        {
            name: 'Winter',
            months: [12, 1, 2]
        }
    ]


    // TODO: -> Redux
    const currentPlotType = selectCurrentPlotType()
    const monthArray = useSelector(state => state.plot[currentPlotType].months)
    const [time, setTime] = React.useState(monthArray); //new Array(12).fill(true)

    /**
     * handles if a users wants to select / deselect a season
     * @param {*} event the event that triggered a function call
     * @param {*} season the index of the season that has been clicked
     */
    const handleChangeSeason = (event, season) => {
    }

    /**
     * selects / deselects all year
     */
    const handleChangeYear = () => {
        // pass
    }

    const handleChangeMonth = (event, month) => {
        // pass
    }

    const handleUpdatedSelection = () => {
        dispatch(setMonths(time))
    }

    return (
        <> 
            {sesaons.forEach((elem, idx) => {
                <SeasonCheckBoxGroup
                    name={elem.name}
                    months={elem.months}
                    monthsSelected = {
                        time.map((x, idx) => idx in elem.months ? x : null)
                    }
                    key={idx}
                />
            })}
        </>
    );
}