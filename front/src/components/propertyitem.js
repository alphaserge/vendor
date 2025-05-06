import * as React from 'react';

export default function PropertyItem(props) {
  return <tr>
            <td><span class="item-label">{props.label}:</span></td>
            <td><span class="text-overflow-ellipsis" style={{ maxWidth: props.maxWidth }} title={props.value}>{props.value}</span></td>
         </tr>
}
