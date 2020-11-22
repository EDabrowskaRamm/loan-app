import { ILoanModel } from '../models/ILoanModel'
import { ITableData } from '../models/ITableData'
import { InstalmentType } from '../components/App/App'

export const getRate = (loan: ILoanModel): string => {
    const getQ = 1 + ((loan.interest / 100) / 12);
    const getNumberOfMonths = loan.time * 12;
    const getRate = loan.amount * Math.pow(getQ, getNumberOfMonths) * (getQ - 1) / (Math.pow(getQ, getNumberOfMonths) - 1);
    return getRate.toFixed(2);
}

export const getTableData = (loan: ILoanModel, instalmentType: InstalmentType): ITableData[] => {
    const dataArr: ITableData[] = [];
    let data: ITableData = {
        month: 0,
        initialCapitalBalance: loan.amount,
        paymentOfInterest: 0,
        creditRepayment: 0,
        fullInstallment: 0,
        remainingOutstanding: 0
    }

    if (instalmentType === "fixed") {
        let equity: number = 0;

        for (let i = 0; i < loan.time * 12; i++) {
            const initial: number = loan.amount - equity;
            const interest: number = initial * (loan.interest / 100) * (365 / 12) / 365;
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
    } else {
        let equity: number = loan.amount;

        for (let i = 0; i < loan.time * 12; i++) {
            const interest: number = ((loan.amount - (i * getDeclinedInstalmentEquity(loan))) * (loan.interest / 100)) / 12;
            const initial: number = equity;

            equity -= getDeclinedInstalmentEquity(loan);

            data = {
                month: i + 1,
                initialCapitalBalance: initial,
                paymentOfInterest: interest,
                creditRepayment: getDeclinedInstalmentEquity(loan),
                fullInstallment: getDeclinedInstalmentEquity(loan) + interest,
                remainingOutstanding: equity
            }
            dataArr.push(data);
        }
    }

    return dataArr;
}


const getDeclinedInstalmentEquity = (loan: ILoanModel): number => {
    return loan.amount / (loan.time * 12);
}

export const getDeclinedInstalmentInterestRate = (loan: ILoanModel): number => {
    let result: number = 0;

    for (let i = 0; i < loan.time * 12; i++) {
        result += ((loan.amount - (i * getDeclinedInstalmentEquity(loan))) * (loan.interest / 100)) / 12;
    }

    return result;
}

export const getMinMaxDeclinedInstalmentRate = (loan: ILoanModel) => {
    const data: ITableData[] = getTableData(loan, "declining");
    const firstEl = data.shift();
    const lastEl = data.pop();

    return {
        min: lastEl ? lastEl.fullInstallment : 0,
        max: firstEl ? firstEl.fullInstallment : 0
    }
}