import React, { useState, useEffect } from 'react';
import './App.css';

import { ILoanModel } from '../../models/ILoanModel'
import Table from '../Table/Table'
import { getRate, getTableData, getDeclinedInstalmentInterestRate, getMinMaxDeclinedInstalmentRate } from '../../utils/calculations'

type LoanType = "housing" | "car";
export type InstalmentType = "declining" | "fixed";

const App = () => {
	const [loan, setLoan] = useState<ILoanModel>({
		amount: 0,
		time: 0,
		interest: 3.5
	});
	const [loanType, setLoanType] = useState<LoanType>("housing");
	const [results, setResults] = useState(false);
	const [monthlyRate, setMonthlyRate] = useState("");
	const [instalmentType, setInstalmentType] = useState<InstalmentType>("fixed");

	useEffect(() => {
		if (loanType === "housing") {
			setLoan({
				...loan,
				interest: 3.5
			});
		} else {
			setLoan({
				...loan,
				interest: 5
			});
		}
	}, [loanType]);

	const onSelectLoanType = (event: React.ChangeEvent) => {
		const target = event.target as HTMLInputElement;
		setLoanType(target.name as LoanType);
	}

	const onSetAmount = (event: React.ChangeEvent) => {
		const target = event.target as HTMLInputElement;
		setLoan({
			...loan,
			amount: Number(target.value)
		});
	}

	const onSetTime = (event: React.ChangeEvent) => {
		const target = event.target as HTMLInputElement;
		setLoan({
			...loan,
			time: Number(target.value)
		});
	}

	const onSelectInstalmentType = (event: React.ChangeEvent) => {
		const target = event.target as HTMLInputElement;
		setInstalmentType(target.name as InstalmentType);
	}

	const onGetData = (event: React.MouseEvent) => {
		event.preventDefault();
		if (instalmentType === "fixed") {
			const data = getRate(loan);
			setMonthlyRate(data);
		} else {

		}
		setResults(true);
	}

	const onResetData = () => {
		setLoan({
			amount: 0,
			time: 0,
			interest: 3.5
		});
		setResults(false);
	}

	const getCostOfCredit: number = (loan.time * 12) * Number(monthlyRate);
	const getAmountOfInterest: number = getCostOfCredit - loan.amount;
	const disabledBtn: boolean = loan.amount <= 0 || loan.time <= 0;

	return (
		<div className="App">
			<header className="App__header">
				<h1>simple loan calculator</h1>
			</header>
			<main className="App__main">
				<form className="App__form">
					<div className="App__radio-wrapper">
						<label className="App__radio">
							Housing loan
							<input
								type="checkbox"
								checked={loanType === "housing"}
								onChange={onSelectLoanType}
								name="housing"
								disabled={results}
							/>
						</label>
						<label className="App__radio">
							Car loan
							<input
								type="checkbox"
								checked={loanType === "car"}
								onChange={onSelectLoanType}
								name="car"
								disabled={results}
							/>
						</label>
					</div>
					<div className="App__input-wrapper">
						<label className="App__input">
							Desired amount:
							<input
								type="number"
								value={loan.amount}
								onChange={onSetAmount}
								className="App__input-box"
								disabled={results}
							/>
						</label>
						<label className="App__input">
							Payback time (in years):
							<input
								type="number"
								value={loan.time}
								onChange={onSetTime}
								className="App__input-box"
								disabled={results}
							/>
						</label>
					</div>
					<div className="App__radio-wrapper">
						<label className="App__radio">
							Declining instalments
							<input
								type="checkbox"
								checked={instalmentType === "declining"}
								onChange={onSelectInstalmentType}
								name="declining"
								disabled={results}
							/>
						</label>
						<label className="App__radio">
							Fixed instalments
							<input
								type="checkbox"
								checked={instalmentType === "fixed"}
								onChange={onSelectInstalmentType}
								name="fixed"
								disabled={results}
							/>
						</label>
					</div>
					<button
						type="submit"
						onClick={onGetData}
						disabled={disabledBtn}
						className="App__btn"
					>
						calculate
					</button>
					{results && <button type="button" onClick={onResetData} className="App__btn">
						reset
					</button>}
				</form>
				{results && <>
					{instalmentType === "fixed"
						? <div>
							<p>
								Total monthly rate: &nbsp;
							<span>{monthlyRate}</span>
							</p>
							<p>
								Full cost of credit: &nbsp;
							<span>{getCostOfCredit.toFixed(2)}</span>
							</p>
							<p>
								Amount of interest: &nbsp;
							<span>{getAmountOfInterest.toFixed(2)}</span>
							</p>
						</div>
						: <div>
							<p>
								Amount of the first instalment: &nbsp;
							<span>{getMinMaxDeclinedInstalmentRate(loan).max.toFixed(2)}</span>
							</p>
							<p>
								Amount of the last instalment: &nbsp;
							<span>{getMinMaxDeclinedInstalmentRate(loan).min.toFixed(2)}</span>
							</p>
							<p>
								Interest sum: &nbsp;
							<span>{getDeclinedInstalmentInterestRate(loan).toFixed(2)}</span>
							</p>
						</div>
					}
					<Table data={getTableData(loan, instalmentType)} />
				</>}
			</main>
			<footer className="App__footer">
				<p>made by EDR</p>
			</footer>
		</div>
	);
}

export default App;
