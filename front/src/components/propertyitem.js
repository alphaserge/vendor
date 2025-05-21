import * as React from 'react';

export default function PropertyItem(props) {
  return <tr style={{ height: "28px" }}>
            <td><span class="item-label">{props.label}</span></td>
            <td><span class="item-value text-overflow-ellipsis" style={{ maxWidth: props.maxWidth }} title={props.value}>{props.value}</span></td>
         </tr>
}
