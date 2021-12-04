import * as React from 'react';
import {AppearenceSection, FilterDataSection, ModelsSection, ReferenceYearSection} from './AppSubComponents/SectionComponents';
import {Button} from './BasicComponents'

function downloadHandler() {
    return "TODO";
}


export default function Sidebar(props) {
    return (<> {props.open && 
    (<div>
        <AppearenceSection />
        <ModelsSection />
        <FilterDataSection />
        <ReferenceYearSection />
        <Button text="Download" onClick={downloadHandler}/>
    </div>)
    } </>);
}