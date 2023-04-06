import react from 'react';
import './App.css';
import Title from './components/Title/Title';
import BudgetCard from './components/BudgetCard/BudgetCard';
import Search from './components/Search/Search';
import GoodsList from './components/GoodsList/GoodsList';
import AddExpenses from './components/AddExpenses/AddExpenses';

class App extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
      budget: 2000,
      list: [
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
      ],
      searchList: [],
      readOnly: true,
      updatedValueOfBudget: '',
    };
  }

  componentDidMount() {}

  // componentWillUnmount() {
  //   console.log("in unmount");
  //   document.removeEventListener("mousemove", this.onMousePositionChange);
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.x > prevState.y && prevState.color !== "yellow") {
  //     this.setState({
  //       color: "yellow",
  //     });
  //   } else if (prevState.y > prevState.x && prevState.color !== "green") {
  //     this.setState({
  //       color: "green",
  //     });
  //   }
  // }

  // onMousePositionChange = (event) => {
  //   const xCoorindinate = event.clientX;
  //   const yCoorindinate = event.clientY;
  //   console.log("x=", xCoorindinate, " y=", yCoorindinate);
  //   this.setState({
  //     x: xCoorindinate,
  //     y: yCoorindinate,
  //   });
  // };
  updateExpenseList = (data) => {
    this.setState({
      list: [...this.state.list, data],
    });
  };

  makeEditable = () => {
    this.setState({
      readOnly: false,
    });
  };

  getInputValue = (value) => {
    this.setState({
      updatedValueOfBudget: value,
    });
  };

  UpdateAllValue = () => {
    this.setState({
      budget: this.state.updatedValueOfBudget,
      updatedValueOfBudget: '',
      readOnly: true,
    });
  };

  deleteList = (id) => {
    const updatedList = this.state.list.filter((item) => item.id !== id);
    console.log('updatedList', updatedList);
    this.setState({
      list: updatedList,
    });
  };

  searchList = (value) => {
    const stampList = this.state.list;
    const filteredData = stampList.filter((row) => {
      const values = Object.values(row).join('').toLowerCase();
      return values.includes(value.toLowerCase());
    });
    this.setState({
      searchList: value ? filteredData : [],
    });
  };

  render() {
    const totalSpent = () => {
      let sum = 0;
      this.state.list.forEach((item) => {
        sum = sum + +item.cost;
      });
      return sum;
    };
    const remainingAmount = this.state.budget - totalSpent();
    return (
      <main>
        <div className='mainBox'>
          <Title text='My Budget Planner' />
          <div className='budgetCardWrapper'>
            <BudgetCard
              label='Budget'
              bgColor='#e7e7e7'
              value={
                this.state.updatedValueOfBudget
                  ? this.state.updatedValueOfBudget
                  : this.state.budget
              }
              updateButton
              readOnly={this.state.readOnly}
              onEdit={this.makeEditable}
              updateMainBudget={this.getInputValue}
              updateValue={this.UpdateAllValue}
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
          <Search searchFunction={this.searchList} />

          <GoodsList
            list={
              this.state.searchList.length
                ? this.state.searchList
                : this.state.list
            }
            deleteFunction={this.deleteList}
          />
          <Title text='Add Expenses' />
          <AddExpenses updateFunction={this.updateExpenseList} />
        </div>
      </main>
    );
  }
}

export default App;
