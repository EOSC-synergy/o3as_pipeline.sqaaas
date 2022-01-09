import React from "react";
import { useDispatch } from "react-redux"
import { setLocation } from "../../../../../store/plotSlice";
import {Box, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";

/**
 * Enables the user to choose minimum and maximum latitude
 * @param {Object} props
 * @param {function} props.reportError - error handling
 * @returns {JSX.Element} a JSX containing a dropdown and if "individual latitude band" is selected a number input field
 */
function LatitudeBandSelector(props) {

    let i = props.reportError;

    const min = -90;
    const max = +90;
    const predefinedOptions = [
        {
            name: "global",
            min: 90,
            max: -90
        }
    ]

    // const dispatch = useDispatch()
    const [latitudeBand, setLatitudeBand] = React.useState();
    const handleChangeLatitudeBand = (event) => {
        setLatitudeBand(event.target.value);
    };
    const [textFieldValue1, setTextFieldValue1] = React.useState();
    const handleChangeTextFieldValue1 = (event) => {
        setTextFieldValue1(event.target.value);
    };
    const [textFieldValue2, setTextFieldValue2] = React.useState();
    const handleChangeTextFieldValue2 = (event) => {
        setTextFieldValue2(event.target.value);
    };

    const locationToTextField = (latitudeBand) => {
        if (latitudeBand === 9) {
            return ["long", "lat"];
        } else if (latitudeBand === 8) {
            return ["lat min", "lat max"]
        }
    }
    return (
        <>
            <Divider>LATITUDE BAND</Divider>
            <Box sx={{paddingLeft: '8%', paddingRight: '8%', paddingTop: '3%'}}>
                <FormControl sx={{width: '100%' }}>
                    <Select
                        labelId="latitudeBandSelectorLabel"
                        id="latitudeBandSelector"
                        value={latitudeBand}
                        label="LatitudeBand"
                        onChange={handleChangeLatitudeBand}
                    >
                        <MenuItem value={1}>Southern Hemisphere (SH) Polar (90–60°S)</MenuItem>
                        <MenuItem value={2}>SH Mid-Latitudes (60–35°S)</MenuItem>
                        <MenuItem value={3}>Tropics (20°S–20°N)</MenuItem>
                        <MenuItem value={4}>Northern Hemisphere (NH) Mid-Latitudes (35–60°N)</MenuItem>
                        <MenuItem value={5}>NH Polar (60–90°N)</MenuItem>
                        <MenuItem value={6}>Near-Global (60°S–60°N)</MenuItem>
                        <MenuItem value={7}>Global (90°S–90°N)</MenuItem>
                        <MenuItem value={8}>Latitude Band</MenuItem>
                        <MenuItem value={9}>Custom</MenuItem>
                    </Select>
                    <InputLabel id="latitudeBandSelectorLabel">Latitude Band</InputLabel>
                    {
                        (latitudeBand === 8 || latitudeBand === 9) &&
                        <Grid container direction="row" style={{paddingTop: '1.5em'}} justifyContent="center" alignItems="center">

                            <Grid item xs={4}>
                                <Typography>
                                    {locationToTextField(latitudeBand)[0]}
                                </Typography>
                            </Grid>

                            <Grid item xs={8}>
                                <TextField
                                    id="textField1" // maybe change name?
                                    label={locationToTextField(latitudeBand)[0]}
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="standard"
                                    size="small"
                                    value={textFieldValue1}
                                    onChange={handleChangeTextFieldValue1}
                                    error={(textFieldValue1 < min || textFieldValue1 > max)}
                                    helperText={(textFieldValue1 < min || textFieldValue1 > max) ? `value must be between ${min} and ${max}` : " "}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Typography>{locationToTextField(latitudeBand)[1]}</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    id="textField2" // maybe change name?
                                    label={locationToTextField(latitudeBand)[1]}
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="standard"
                                    size="small"
                                    value={textFieldValue2}
                                    onChange={handleChangeTextFieldValue2}
                                    error={(textFieldValue2 < min || textFieldValue2 > max)}
                                    helperText={(textFieldValue2 < min || textFieldValue2 > max) ? `value must be between ${min} and ${max}` : " "}
                                />
                            </Grid>
                        </Grid>
                    }

                </FormControl>
            </Box>
        </>
    );
}

export default LatitudeBandSelector;