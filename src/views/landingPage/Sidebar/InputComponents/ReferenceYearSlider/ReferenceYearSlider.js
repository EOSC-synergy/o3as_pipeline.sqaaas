import React from "react";
import { Grid, Typography, Slider, FormControl, TextField } from "@mui/material";
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux";
import { setYear } from "../../../../../store/referenceSlice/referenceSlice";
import {END_YEAR, START_YEAR} from "../../../../../utils/constants";

/**
 * Enables the user to select a reference year.
 * @param {Object} props
 * @param {function} props.reportError - function to handle errors
 * @returns {JSX.Element} a jsx containing a text field to select the reference year
 */
function ReferenceYearSlider(props) {
    /**
     * A dispatch function to dispatch actions to the redux store.
     */
    const dispatch = useDispatch();

    /**
     * The selected reference year from the redux store.
     */
    const selectedYear = useSelector(state => state.reference.settings.year);

    /**
     * Handles the change of the reference year field if is modified.
     */
    const handleChangeForRefYear = (event) => {
        dispatch(setYear({year: event.target.value}));
    };

    return (
        <>
        <Grid container sx={{width: "90%", marginLeft: "auto", marginRight: "auto", marginTop: "5%"}}>
            <Grid item xs={5}>
            <Typography>Reference year:</Typography>
            </Grid>
            <Grid item xs={7} sx={{mt: "-8px"}}>
                <FormControl sx={{width: '35%'}}>
                    <TextField
                        variant="outlined"
                        id="outlined-basic"
                        size="small"
                        value={selectedYear}
                        onChange={handleChangeForRefYear}
                        error={selectedYear < START_YEAR || selectedYear > END_YEAR}
                        helperText={selectedYear < START_YEAR ? `<${START_YEAR}` : (selectedYear > END_YEAR ? `>${END_YEAR}` : '')}
                    />
                </FormControl>
            </Grid>
        </Grid>
        </>
    );
}

export default ReferenceYearSlider;
