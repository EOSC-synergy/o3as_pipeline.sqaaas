import * as React from 'react';

export default function ListBox(props) {
    const options = props.items.map((item) => (<option value={item}>{item}</option>))
    return (<div>
    <select name={props.text}>
        {options}
    </select>
    </div>);
}