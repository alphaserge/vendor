import * as React from 'react';

export default function PropertyItem(props) {
  return <tr style={{ height: "30px", verticalAlign: "top" }}>
            <td><span class="item-label">{props.label}</span></td>
            <td><span class="item-value" style={{ maxWidth: props.maxWidth }} title={props.value}>{props.value}</span></td>
         </tr>
}
