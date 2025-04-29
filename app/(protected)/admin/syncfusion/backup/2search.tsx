/* eslint-disable @typescript-eslint/no-empty-object-type */
import { getValue } from '@syncfusion/ej2-base';
import { DataManager, Query, ReturnOption } from '@syncfusion/ej2-data';
import * as React from 'react';
import { data } from '../data/datasource';
import { Row } from './rowtemplate';
import { Department } from '@/app/models/department';

export default class Search2Page extends React.Component<{}, {}>{
    public dm: DataManager;
    public style: { [x: string]: string };
    public changes: {
        addedRecords: object[],
        changedRecords: object[],  
        deletedRecords: object[]
    };
    constructor(props: object) {
        super(props);
        this.state = { items: [] };
        this.style = { class: 'e-form' };
        this.changes = { changedRecords: [], addedRecords: [], deletedRecords: [] };
        this.dm = new DataManager(data.slice(0, 5));
        this.dm.executeQuery(new Query())
      .then((e: ReturnOption) => {
        this.setState({
          items: (e.result as Department[]).map((row: Department) => (
            <Row key={row.name} {...row} />
          ))
        });
      });
        // this.dm.executeQuery(new Query())
        //     .then((e: ReturnOption) => {
        //         this.setState({
        //             items: (e.result as object[]).map((row: object) => (<Row {...row}/>))
        //         });
        //     });
        this.action = this.action.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
    }

    public action(event: React.MouseEvent) {
        let action: string = event.currentTarget.getAttribute('value') as string;
        action = (action === 'Update' ? 'changed' : action === 'Insert' ? 'added' : 'deleted') + 'Records';
        const _name: HTMLInputElement = document.getElementById('name') as HTMLInputElement;
        const cusid: HTMLInputElement = document.getElementById('description') as HTMLInputElement;
        const empid: HTMLInputElement = document.getElementById('slug') as HTMLInputElement;
        const rowdata: { name: string, description: string, slug: string } = {
            name: cusid.value,
            description: empid.value,
            slug: _name.value
        };
        if (!rowdata.name) { return; }
        (this.changes[action as keyof typeof this.changes] as object[]).push(rowdata);
        _name.value = cusid.value = empid.value = '';
    }

    public saveChanges(): void {
        this.dm.saveChanges(this.changes);
        this.dm.executeQuery(new Query())
            .then((e: ReturnOption) => {
                this.setState({
                    items: (e.result as Department[]).map((row: Department) => (
                        <Row key={row.name} {...row} />
                      ))
                });
            });
        this.changes = { changedRecords: [], addedRecords: [], deletedRecords: [] };
    }

    public render() {
        return (<div><div style={this.style}>
            <input type="number" id='name' placeholder="Order ID" />
            <input type="text" id="description" placeholder="Customer ID" />
            <input type="number" id="slug" placeholder="Employee ID" />
            <input type="button" value="Insert" onClick={this.action} />
            <input type="button" value="Update" onClick={this.action} />
            <input type="button" value="Remove" onClick={this.action} /></div>
            <div style={this.style}>
                <label>Click to Save changes:</label>
                <input type="button" value="Save Changes" onClick={this.saveChanges} /></div>
            <div><table id='datatable' className='e-table'>
                <thead>
                    <tr><th>Order ID</th><th>Customer ID</th><th>Employee ID</th></tr>
                </thead>
                <tbody>{getValue('items', this.state)}</tbody>
            </table></div></div>)
    }
}