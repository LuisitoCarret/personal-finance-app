import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { allTransactionsByMonth } from '../../services/transactionService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PrivateNavbar from '../../components/PrivateNavbar';
import './ExpensesMonth.style.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function ExpensesMonth() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const yearParam = searchParams.get('year') || String(new Date().getFullYear());
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchListByMonth() {
      const result = await allTransactionsByMonth(yearParam);
      if (result) {
        setItems(result);
      }
    }
    fetchListByMonth();
  }, [yearParam]);

  const hasData = items.length > 0 && items.some((item) => item.amount > 0);
  const totalAmount = items.reduce((total, item) => total + Number(item.amount || 0), 0);
  const peakMonth = items.reduce(
    (peak, item) => Number(item.amount) > Number(peak.amount) ? item : peak,
    items[0] || { month: 0, amount: 0 },
  );
  const peakMonthName = monthLabels[Number(peakMonth.month) - 1] || 'No activity';
  const data = {
    labels: monthLabels,
    datasets: [{
      label: 'Expenses',
      data: items.map((item) => item.amount),
      backgroundColor: items.map((item) => (
        Number(item.month) === Number(peakMonth.month) ? '#167c65' : '#a9d6c1'
      )),
      hoverBackgroundColor: items.map((item) => (
        Number(item.month) === Number(peakMonth.month) ? '#116951' : '#82c2a3'
      )),
      borderRadius: 8,
      borderSkipped: false,
      maxBarThickness: 44,
    }],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => ` ${currencyFormatter.format(context.raw)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: '#758391',
          maxRotation: 0,
          minRotation: 0,
          font: { family: 'Inter, sans-serif', size: 11 },
        },
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: '#edf1ef' },
        ticks: {
          color: '#758391',
          padding: 10,
          callback: (value) => `$${Number(value).toLocaleString('en-US')}`,
          font: { family: 'Inter, sans-serif', size: 11 },
        },
      },
    },
  };

  return (
    <div className="transaction-page transaction-page--charts transaction-page--months">
      <PrivateNavbar />
      <main className="transaction-shell chart-page-shell">
        <header className="transaction-page-heading chart-page-heading">
          <div>
            <span className="transaction-eyebrow">YEARLY TREND</span>
            <h1>Monthly expenses</h1>
            <p>Compare your spending from month to month in {yearParam}.</p>
          </div>
          <button className="transaction-button transaction-button--secondary" onClick={() => navigate('/history')}>
            Back to history
          </button>
        </header>

        {!hasData ? (
          <section className="chart-empty-state chart-empty-state--months">
            <div className="chart-empty-state__icon" aria-hidden="true">$</div>
            <h2>No expenses found for {yearParam}</h2>
            <p>There is no monthly activity to display for this year yet.</p>
            <button className="transaction-button transaction-button--primary" onClick={() => navigate('/home-transaction')}>
              Add a transaction
            </button>
          </section>
        ) : (
          <>
            <section className="month-summary">
              <article className="month-summary-card month-summary-card--total">
                <span>Expenses this year</span>
                <strong>{currencyFormatter.format(totalAmount)}</strong>
                <small>Across all recorded transactions</small>
              </article>
              <article className="month-summary-card month-summary-card--peak">
                <span>Highest-spend month</span>
                <strong>{peakMonthName}</strong>
                <small>{currencyFormatter.format(Number(peakMonth.amount))}</small>
              </article>
            </section>
            <section className="month-chart-card">
              <div className="month-chart-card__heading">
                <div>
                  <span className="transaction-eyebrow">SPENDING OVER TIME</span>
                  <h2>Monthly breakdown</h2>
                </div>
                <span className="month-chart-card__year">{yearParam}</span>
              </div>
              <div className="month-chart-plot">
                <Bar data={data} options={options} />
              </div>
              <p className="month-chart-note">
                <span /> Highest month: <strong>{peakMonthName}</strong>
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default ExpensesMonth;
