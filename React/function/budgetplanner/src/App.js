import{ useState } from 'react';
import './App.css';
import Title from './components/Title/Title';
import BudgetCard from './components/BudgetCard/BudgetCard';
import Search from './components/Search/Search';
import GoodsList from './components/GoodsList/GoodsList';
import AddExpenses from './components/AddExpenses/AddExpenses';

const initialData = [
  {
    id: 123,
    name: 'bottle',
    cost: 150,
  },
  {
    id: 124,
    name: 'bottle4',
    cost: 150,
  },
  {
    id: 125,
    name: 'bottle5',
    cost: 150,
  },
];
function App() {
  const [budget, setBudget] = useState('');
  const [list, setList] = useState(initialData);
  const [searchList, setSearchList] = useState('');
  const [readOnly, setReadOnly] = useState(true);
  const [updatedValueOfBudget, setUpdatedValueOfBudget] = useState('');

  const updateExpenseList = (data) => {
    setList([...list, data])
  };

  const makeEditable = () => {
    setReadOnly(false)
  };

  const getInputValue = (value) => {
    setUpdatedValueOfBudget(value)
  };

  const UpdateAllValue = () => {
    setBudget(updatedValueOfBudget)
    setUpdatedValueOfBudget("")
    setReadOnly(true)
  };

  const deleteList = (id) => {
    const updatedList = list.filter((item) => item.id !== id);
    console.log('updatedList', updatedList);
    setList(updatedList)
  };

  const searchData = (value) => {
    const stampList = list;
    const filteredData = stampList.filter((row) => {
      const values = Object.values(row).join('').toLowerCase();
      return values.includes(value.toLowerCase());
    });
    setSearchList(value ? filteredData : [])
  };

  const totalSpent = () => {
    let sum = 0;
    list.forEach((item) => {
      sum = sum + +item.cost;
    });
    return sum;
  };
  const remainingAmount = budget - totalSpent();
  return (
    <main>
      <div className='mainBox'>
        <Title text='My Budget Planner' />
        <div className='budgetCardWrapper'>
          <BudgetCard
            label='Budget'
            bgColor='#e7e7e7'
            value={updatedValueOfBudget ? updatedValueOfBudget : budget}
            updateButton
            readOnly={readOnly}
            onEdit={makeEditable}
            updateMainBudget={getInputValue}
            updateValue={UpdateAllValue}
          />
          <BudgetCard
            label='Remaining'
            bgColor='#e5f5d3'
            value={remainingAmount}
            readOnly={true}
          />
          <BudgetCard
            label='Spent'
            bgColor='#dff5ff'
            value={totalSpent()}
            readOnly={true}
          />
        </div>
        <Title text='Expenses' />
        <Search searchFunction={searchData} />

        <GoodsList
          list={searchList.length ? searchList : list}
          deleteFunction={deleteList}
        />
        <Title text='Add Expenses' />
        <AddExpenses updateFunction={updateExpenseList} />
      </div>
    </main>
  );
}

export default App;
