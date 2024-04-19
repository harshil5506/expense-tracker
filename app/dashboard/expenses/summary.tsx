'use client';

import SummaryCard from 'components/card/summary-card';
import { useUser } from 'components/context/auth-provider';
import { useData } from 'components/context/data-provider';
import CardLoader from 'components/loader/card';

import { formatCurrency } from 'lib/formatter';
import { useEffect, useState } from 'react';

export default function ExpensesSummary() {
	const user = useUser();
	const { data = [], loading = true } = useData();
	const [cashTot, setCashTot] = useState(0);
	const [cashlessTot, setCashlessTot] = useState(0);

	useEffect(() => {
		console.log(data);
		if (data.length > 1) {
			let cash: Number = 0;
			let cashLess: Number = 0;
			data.forEach(element => {
				if (element.paid_via === 'cash') {
					cash = cash + Number(element.price);
				} else {
					cashLess = cashLess + Number(element.price);
				}
			});
			console.log(cash, cashLess);
			setCashTot(cash);
			setCashlessTot(cashLess);
		}
	}, [data]);

	return (
		<>
			<h2 className="mb-4 font-semibold text-primary dark:text-white">Summary</h2>
			{loading ? (
				<CardLoader cards={2} className="mb-6" />
			) : (
				<div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
					<SummaryCard title="total expenses" data={data.length} />
					<SummaryCard
						title="total amount"
						data={formatCurrency({
							value: data.reduce((acc: any, datum: any) => Number(datum.price) + acc, 0),
							currency: user?.currency,
							locale: user?.locale,
						})}
					/>
					<SummaryCard title="Cash" data={formatCurrency({ value: cashTot })} />
					<SummaryCard title="Cashless" data={formatCurrency({ value: cashlessTot })} />
				</div>
			)}
		</>
	);
}
