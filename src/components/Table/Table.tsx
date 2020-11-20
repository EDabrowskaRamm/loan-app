import React from 'react';
import { ITableData } from '../../models/ITableData'

type TableProps = { data: ITableData[] }

const Table = ({ data }: TableProps) => {

    return (
        <table>
            <thead>
                <tr>
                    <td>Month</td>
                    <td>Initial capital balance</td>
                    <td>Payment of interest</td>
                    <td>Credit repayment</td>
                    <td>Full installment</td>
                    <td>Remaining outstanding</td>
                </tr>
            </thead>
            <tbody>
                {data.map(el => <tr key={el.month}>
                    <td>{el.month}</td>
                    <td>{el.initialCapitalBalance.toFixed(2)}</td>
                    <td>{el.paymentOfInterest.toFixed(2)}</td>
                    <td>{el.creditRepayment.toFixed(2)}</td>
                    <td>{el.fullInstallment.toFixed(2)}</td>
                    <td>{el.remainingOutstanding.toFixed(2)}</td>
                </tr>)}
            </tbody>
        </table>
    );
}

export default Table;