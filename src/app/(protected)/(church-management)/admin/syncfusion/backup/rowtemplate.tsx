import * as React from 'react';
import { Department } from '@/src/business-layer/church-management/models/department';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export class Row extends React.Component<{}, {}>{
    public render() {
        const item: Department = this.props as Department; 
        return (<tr>
                 <td>{item.name}</td>
                 <td>{item.description}</td>
                 <td>{item.slug}</td>
                </tr>)
    }
}