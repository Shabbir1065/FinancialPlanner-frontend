import { useEffect, useState } from "react";
import axios from "axios"

export const Home = () => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [investments, setInvestments] = useState([]);
    const [incomeTotal, setIncomeTotal] = useState();
    const [expenseTotal, setExpenseTotal] = useState();
    const [investmentTotal, setInvestmentTotal] = useState();
    const [breakdownTotal, setBreakdownTotal] = useState();

    const username = window.localStorage.getItem("username");
    const userID = window.localStorage.getItem("userID");

    useEffect(() => {
        
        const fetchFinances = async () => {
            try{
                refreshPage();
            }
            catch(err){
                console.error(err);
            }
        };
        
        fetchFinances();
    }, []);

    const refreshPage = async () => {
        //section for incomes
        const incomeResponse = await axios.get(`http://localhost:3001/api/userFinanceByType/${userID}/income`);
        setIncomes(incomeResponse.data);
        const newIncomeTotal = incomeResponse.data.reduce((n, {value}) => n + value, 0);
        setIncomeTotal(newIncomeTotal);

        //section for expenses
        const expenseResponse = await axios.get(`http://localhost:3001/api/userFinanceByType/${userID}/expense`);
        setExpenses(expenseResponse.data);
        const newExpenseTotal = expenseResponse.data.reduce((n, {value}) => n + value, 0);
        setExpenseTotal(newExpenseTotal);

        //section for investments
        const investementResponse = await axios.get(`http://localhost:3001/api/userFinanceByType/${userID}/investment`);
        setInvestments(investementResponse.data);
        const newInvestmentTotal = investementResponse.data.reduce((n, {value}) => n + value, 0);
        setInvestmentTotal(newInvestmentTotal);

        setBreakdownTotal(newIncomeTotal-(newExpenseTotal+newInvestmentTotal));
    }

    return (
    <div>
        <h2 className="welcomeUser"> Welcome {username}!</h2>
        <h2 className="welcomeUser">Please enter your incomes, expenses, and investments:</h2>
        <UserInput
        refreshPage = {refreshPage}
        />
        <FinanceSummary
        incomes={incomes}
        expenses={expenses}
        investments={investments}
        incomeTotal={incomeTotal}
        expenseTotal={expenseTotal}
        investmentTotal={investmentTotal}
        breakdownTotal={breakdownTotal}
        refreshPage = {refreshPage}
        />
    </div>
    );
}

const UserInput = ({refreshPage}) => {
    const [description, setDescription] = useState("");
    const [value, setValue] = useState("");
    const [financeType, setFinanceType] = useState("income");

    const userID = window.localStorage.getItem("userID");
    
    const onSubmit = async (event) => {
        event.preventDefault();
        try{
            await axios.post("http://localhost:3001/api", {userID, "finances": [{description, value, financeType}]});
            //---------RE-RENDER STUFF--------
            refreshPage();
            
        } catch (err){
            console.error(err);
        }
    }

    return(
        <div className="userInput">
            <form onSubmit={onSubmit} className="userInputForm">
                <div className="input-field">
                    <input type="text" 
                    placeholder="Description"
                    id="description"
                    value = {description}
                    onChange={(event => setDescription(event.target.value))}/>
                </div>
                <div className="input-field">
                    <input type="number" 
                    placeholder="value"
                    id="value"
                    value = {value}
                    onChange={(event => setValue(event.target.value))}/>
                </div>
                <div className="input-field">
                    <select id="financeType" value = {financeType} onChange={(event => setFinanceType(event.target.value))}>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                        <option value="investment">Investment</option>
                    </select>
                </div>
                <button type="submit" className="addToPlanner">Add to planner</button>
            </form>
        </div>
    );
}

const FinanceSummary = ({incomes, expenses, investments, incomeTotal, expenseTotal, investmentTotal, breakdownTotal, refreshPage}) => {
    const userID = window.localStorage.getItem("userID");

    const deleteItem = async (financeID) => {
        try{
            await axios.delete("http://localhost:3001/api/deleteFinance", {data: {userID, financeID}});
            refreshPage();

        }
        catch(err){
            console.error(err);
        }
    };

    const updateItem = async (financeID) => {
        try{
            const newDescription = prompt("Enter new description: ");
            const newValue = prompt("Enter new value: ")
            await axios.put("http://localhost:3001/api/updateFinance", {userID,financeID, "description": newDescription, "value": newValue});

           refreshPage();
        }
        catch(err){
            console.error(err);
        }
    }

    return(
        <div className="financeSummary">
            <div className="incomes finance-section">
                <h3>Incomes:</h3>
                <div className="finance-ul-items">
                    {incomes.map((income) => (
                        <div className="finance-single-item" key={income._id}>
                            <h4>${income.value} from {income.description}</h4>
                            <button className="updateButton" onClick={() => updateItem(income._id)}>Edit</button>
                            <button className="deleteButton" onClick={() => deleteItem(income._id)}>Delete</button>
                        </div>
                    ))}
                    <div className="totals">
                        <h4>Total Income: {incomeTotal}</h4>
                    </div>
                </div>
            </div>
            <div className="expenses finance-section">
                <h3>Expenses</h3>
                <div className="finance-ul-items">
                    {expenses.map((expense) => (
                        <div className="finance-single-item" key={expense._id}>
                            <h4>${expense.value} from {expense.description}</h4>
                            <button className="updateButton" onClick={() => updateItem(expense._id)}>Edit</button>
                            <button className="deleteButton" onClick={() => deleteItem(expense._id)}>Delete</button>
                        </div>
                    ))}
                    <div className="totals">
                        <h4>Total Expenses: {expenseTotal}</h4>
                    </div>
                </div>
            </div>
            <div className="investments finance-section">
                <h3>Investments</h3>
                <div className="finance-ul-items">
                    {investments.map((investment) => (
                        <div className="finance-single-item" key={investment._id}>
                            <h4>${investment.value} from {investment.description}</h4>
                            <button className="updateButton" onClick={() => updateItem(investment._id)}>Edit</button>
                            <button className="deleteButton" onClick={() => deleteItem(investment._id)}>Delete</button>
                        </div>
                    ))}
                    <div className="totals">
                        <h4>Total Investments: {investmentTotal}</h4>
                    </div>
                </div>
            </div>
            <div className="breakdown finance-section">
                <h3>Breakdown:</h3>
                <h4>Total Incomes - (Total Expenses + Total Investments)</h4>
                <h2>= {breakdownTotal}</h2>
            </div>

        </div>
    );
}