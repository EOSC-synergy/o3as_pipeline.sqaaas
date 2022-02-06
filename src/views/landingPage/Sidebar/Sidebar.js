import * as React from 'react';
import { styled } from '@mui/material/styles';
import Section from './Section/Section.js';
import defaultStructure from '../../../config/defaultConfig.json';
import tco3_zm from '../../../config/tco3_zm.json';
import tco3_return from '../../../config/tco3_return.json';
import DownloadModal from './DownloadModal/DownloadModal.js';
import { selectPlotId } from "../../../store/plotSlice/plotSlice";
import {useSelector} from "react-redux";
import PlotTypeSelector from './InputComponents/PlotTypeSelector/PlotTypeSelector.js';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Button, Typography, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';

/**
 * Defining a drawerheader section at the beginning of a drawer
 */
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

/**
 * Contains all input components responsible for the modification 
 * of the plot settings.
 * @param {Object} props 
 * @param {boolean} props.isOpen -  whether sideBar should be open
 * @param {function} props.onClose - handles closing of the sidebar
 * @param {function} props.reportError - enables component to report an error
 * @param {function} props.onOpen - handles opening of the sidebar
 * @returns {JSX.Element} a jsx containing a sidebar with sections containing input components, a download button and a plotType dropdown
 */
function Sidebar(props) {

    // const dispatch = useDispatch()

    const [isDownloadModalVisible, setDownloadModalVisible] = React.useState(false);
    const [expandedSection, setExpandedSection] = React.useState(null); // -> idx of sections array

    /**
     * closes the download modal
     */
    const closeDownloadModal = () => {
        setDownloadModalVisible(false);
    }

    /**
     * shows the download modal
     */
    const openDownloadModal = () => {
        setDownloadModalVisible(true);
    }

    /**
     * collapses all sections
     */
    const collapseSection = () => {
        setExpandedSection(null);
    }

    /**
     * expands section with id (index in section array) i
     * collapses all other currently expanded sections
     * @param {int} i the section that should be expanded
     */
    const expandSection = (i) => {
        setExpandedSection(i);
    }

    /**
     * The id of the selected plot.
     */
    const selectedPlot = useSelector(selectPlotId);

    /**
     * Creates the structure of the sections depending on the type of plot.
     */
    const createSectionStructure = () => {
        let sections = [...defaultStructure['sections']];
        let specificSections;
        switch(selectedPlot) {
            case "tco3_zm":
                specificSections = tco3_zm['sections'];
                break;
            case "tco3_return":
                specificSections = tco3_return['sections'];
                break;
            default:
                props.reportError("Invalid plot type.");
                return;
        }
        for (let i = 0; i < specificSections.length; i++) {
            let foundMatch = false;
            for (let j = 0; j < sections.length; j++) {
                if (specificSections[i].name === sections[j].name) {
                    sections[j] = specificSections[i];
                    foundMatch = true;
                    break;
                }
            }
            if (!foundMatch) {
                sections.push(specificSections[i]);
            }
        }
        return sections;
    }

    return (
            <SwipeableDrawer
                anchor="right"
                open={props.isOpen}
                onClose={props.onClose}
                onOpen={props.onOpen}
                variant="persistent"
                sx= {{
                    width: 400,
                    maxWidth: "100vw",
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 400,
                        maxWidth: "100vw",
                    },
                }}
                data-testid="sidebar"
            > 
                <DrawerHeader>
                    <IconButton
                        onClick={props.onClose}
                        data-testid="sidebarClose"
                    >
                        <CloseIcon />
                    </IconButton>
                </DrawerHeader>


                <div>
                    <Divider><Typography>SELECT PLOT TYPE</Typography></Divider>
                </div>

                <PlotTypeSelector reportError={ props.reportError }/>

                <div style={{marginBottom: "2%"}}>
                    <Divider><Typography>CONFIGURE PLOT</Typography></Divider>
                </div>

                    {createSectionStructure().map((s, idx) =>
                        <div key={idx} style={{width: "95%", marginBottom: "2%", marginLeft: "auto", marginRight: "auto"}}>
                        <Section
                            name={s.name}
                            key={idx}    
                            isExpanded={idx === expandedSection}                     
                            components={s.components}
                            onCollapse={() => collapseSection(idx)}
                            onExpand={() => expandSection(idx)}
                            reportError={props.reportError}
                        />
                        </div>
                    )}

                    <Button sx={{marginLeft: "10%", marginTop: "1em", width: "80%"}} variant="outlined" onClick={openDownloadModal}>Download</Button>
                    <DownloadModal reportError={props.reportError} isOpen={isDownloadModalVisible} onClose={closeDownloadModal} />
        </SwipeableDrawer>
    );
}

Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    reportError: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onOpen: PropTypes.func.isRequired
}

export default Sidebar;