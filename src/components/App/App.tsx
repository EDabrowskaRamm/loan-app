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

	const getCostOfCredit: number = (loan.time * 12) * Number(monthlyRate);
	const getAmountOfInterest: number = getCostOfCredit - loan.amount;

	return (
		<div className="App">
			<header className="App-header">
				<h1>simple loan calculator</h1>
			</header>
			<main>
				<div>
					<label>
						housing loan
					<input
							type="checkbox"
							checked={loanType === "housing"}
							onChange={onSelectLoanType}
							name="housing"
						/>
					</label>
					<label>
						car loan
					<input
							type="checkbox"
							checked={loanType === "car"}
							onChange={onSelectLoanType}
							name="car"
						/>
					</label>
				</div>
				<div>
					<label>
						desired amount
					<input
							type="number"
							value={loan.amount}
							onChange={onSetAmount}
						/>
					</label>
					<label>
						payback time
					<input
							type="number"
							value={loan.time}
							onChange={onSetTime}
						/>
						<span>* in years</span>
					</label>
					<button onClick={onGetData}>calculate</button>
				</div>
				{results && <>
					<div>
						<p>
							Total monthly rate &nbsp;
							<span>{monthlyRate}</span>
						</p>
						<p>
							Full cost of credit &nbsp;
							<span>{getCostOfCredit.toFixed(2)}</span>
						</p>
						<p>
							Amount of interest &nbsp;
							<span>{getAmountOfInterest.toFixed(2)}</span>
						</p>
					</div>
					<Table data={getTableData(loan)} />
				</>}
			</main>
			<footer>
				<p>made by EDR</p>
			</footer>
		</div>
	);
}

export default App;
