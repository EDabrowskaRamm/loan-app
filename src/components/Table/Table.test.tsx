import React from 'react';
import renderer from 'react-test-renderer'

import Table from './Table';
import { ILoanModel } from '../../models/ILoanModel'
import { getTableData } from '../../utils/calculations'

describe('Table', () => {
    const loan: ILoanModel = {
        amount: 100000,
        time: 2,
        interest: 3.5
    }

    it('Snapshot', () => {
        const component = renderer.create(<Table data={getTableData(loan)} />)
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })
});