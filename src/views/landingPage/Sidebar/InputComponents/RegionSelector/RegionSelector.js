import React, { useState } from "react";
import LatitudeBandSelector from "../LatitudeBandSelector/LatitudeBandSelector";
import LocationSelector from "../LatitudeBandSelector/LatitudeBandSelector";

/**
 * enables the user to select / deselect regions as well as entering a private region {@link LatitudeBandSelector}
 * @todo add redux connection
 * @param {Object} props
 * @param {function} props.reportError - used to report error functions
 * @returns {JSX} 
 */
function RegionSelector(props) {

    let i = props.reportError;

    /**
     * gets default regions that are available in the return recovery plot
     */
    const getDefaultRegions = () => {

    }

    return (
        <>
            RegionSelector
            <LatitudeBandSelector />
        </>
    );
}

export default RegionSelector;