import { ILoanModel } from '../models/ILoanModel'
import { ITableData } from '../models/ITableData'

export const getRate = (loan: ILoanModel): string => {
    const getQ = 1 + ((loan.interest / 100) / 12);
    const getNumberOfMonths = loan.time * 12;
    const getRate = loan.amount * Math.pow(getQ, getNumberOfMonths) * (getQ - 1) / (Math.pow(getQ, getNumberOfMonths) - 1);
    return getRate.toFixed(2);
}

export const getTableData = (loan: ILoanModel): ITableData[] => {
    const dataArr: ITableData[] = [];
    let equity: number = 0;

    let data: ITableData = {
        month: 0,
        initialCapitalBalance: loan.amount,
        paymentOfInterest: 0,
        creditRepayment: 0,
        fullInstallment: 0,
        remainingOutstanding: 0
    }

    for (let i = 0; i < loan.time * 12; i++) {
        let initial: number = loan.amount - equity;
        let interest: number = initial * (loan.interest / 100) * (365 / 12) / 365;
        const thisMonthsInterest: number = initial * (loan.interest / 100 / 12);

        equity += (Number(getRate(loan)) - thisMonthsInterest);

        data = {
            month: i + 1,
            initialCapitalBalance: initial,
            paymentOfInterest: interest,
            creditRepayment: (Number(getRate(loan)) - thisMonthsInterest),
            fullInstallment: (Number(getRate(loan)) - thisMonthsInterest) + interest,
            remainingOutstanding: loan.amount - equity
        }
        dataArr.push(data);
    }

    return dataArr;
}
