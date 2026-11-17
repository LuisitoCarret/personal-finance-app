import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { allTransactionsByCategory } from '../../services/transactionService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PrivateNavbar from '../../components/PrivateNavbar';
import './ExpensesCategory.style.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const categoryColors = ['#167c65', '#72b99b', '#a8d7bf', '#d2a85a', '#8ca7a0'];
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function ExpensesCategory() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const yearParam = searchParams.get('year') || String(new Date().getFullYear());
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchListByCategory() {
      const result = await allTransactionsByCategory(yearParam);
      if (result) {
        setItems(result);
      }
    }
    fetchListByCategory();
  }, [yearParam]);

  const hasData = items.length > 0 && items.some((item) => item.amount > 0);
  const totalAmount = items.reduce((total, item) => total + Number(item.amount || 0), 0);
  const data = {
    labels: items.map((item) => item.category),
    datasets: [{
      data: items.map((item) => item.amount),
      backgroundColor: items.map((_, index) => categoryColors[index % categoryColors.length]),
      borderColor: '#ffffff',
      borderWidth: 4,
      hoverOffset: 8,
    }],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.label}: ${currencyFormatter.format(context.raw)}`,
        },
      },
    },
  };

  return (
    <div className="transaction-page transaction-page--charts transaction-page--category">
      <PrivateNavbar />
      <main className="transaction-shell chart-page-shell">
        <header className="transaction-page-heading chart-page-heading">
          <div>
            <span className="transaction-eyebrow">YEARLY BREAKDOWN</span>
            <h1>Expenses by category</h1>
            <p>See how your spending is divided across categories in {yearParam}.</p>
          </div>
          <button className="transaction-button transaction-button--secondary" onClick={() => navigate('/history')}>
            Back to history
          </button>
        </header>

        {!hasData ? (
          <section className="chart-empty-state">
            <div className="chart-empty-state__icon" aria-hidden="true">$</div>
            <h2>No expenses found for {yearParam}</h2>
            <p>There is no category activity to display for this year yet.</p>
            <button className="transaction-button transaction-button--primary" onClick={() => navigate('/home-transaction')}>
              Add a transaction
            </button>
          </section>
        ) : (
          <section className="category-chart-card">
            <div className="category-chart-card__heading">
              <div>
                <span className="transaction-eyebrow">SPENDING MIX</span>
                <h2>Annual category totals</h2>
              </div>
              <div className="category-chart-card__year">{yearParam}</div>
            </div>
            <div className="category-chart-layout">
              <div className="category-chart-visual">
                <div className="category-chart-plot">
                  <Doughnut data={data} options={options} />
                  <div className="category-chart-center">
                    <span>Total expenses</span>
                    <strong>{currencyFormatter.format(totalAmount)}</strong>
                  </div>
                </div>
              </div>
              <div className="category-breakdown">
                <h3>By category</h3>
                <ul>
                  {items.map((item, index) => (
                    <li key={item.category}>
                      <span className="category-breakdown__marker" style={{ backgroundColor: categoryColors[index % categoryColors.length] }} />
                      <span className="category-breakdown__name">{item.category}</span>
                      <span className="category-breakdown__value">{currencyFormatter.format(Number(item.amount))}</span>
                      <span className="category-breakdown__share">
                        {totalAmount > 0 ? `${Math.round((Number(item.amount) / totalAmount) * 100)}%` : '0%'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default ExpensesCategory;
