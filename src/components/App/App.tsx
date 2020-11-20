import React, { useState, useEffect } from 'react';
import './App.css';

import { ILoanModel } from '../../models/ILoanModel'
import Table from '../Table/Table'
import { getRate, getTableData } from '../../utils/calculations'

type LoanType = "housing" | "car";

const App = () => {
	const [loan, setLoan] = useState<ILoanModel>({
		amount: 0,
		time: 0,
		interest: 3.5
	});
	const [loanType, setLoanType] = useState<LoanType>("housing");
	const [results, setResults] = useState(false);
	const [monthlyRate, setMonthlyRate] = useState("");

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

	const onGetData = (event: React.MouseEvent) => {
		event.preventDefault();
		const data = getRate(loan);
		setResults(true);
		setMonthlyRate(data);
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
							housing loan
							<input
								type="checkbox"
								checked={loanType === "housing"}
								onChange={onSelectLoanType}
								name="housing"
							/>
						</label>
						<label className="App__radio">
							car loan
							<input
								type="checkbox"
								checked={loanType === "car"}
								onChange={onSelectLoanType}
								name="car"
							/>
						</label>
					</div>
					<div className="App__input-wrapper">
						<label className="App__input">
							desired amount:
							<input
								type="number"
								value={loan.amount}
								onChange={onSetAmount}
								className="App__input-box"
								disabled={results}
							/>
						</label>
						<label className="App__input">
							payback time (in years):
							<input
								type="number"
								value={loan.time}
								onChange={onSetTime}
								className="App__input-box"
								disabled={results}
							/>
						</label>
						<button type="submit" onClick={onGetData} disabled={disabledBtn}>
							calculate
						</button>
						{results && <button type="button" onClick={onResetData}>
							reset
						</button>}
					</div>
				</form>
				{results && <>
					<div>
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
					<Table data={getTableData(loan)} />
				</>}
			</main>
			<footer className="App__footer">
				<p>made by EDR</p>
			</footer>
		</div>
	);
}

export default App;
