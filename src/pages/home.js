import { useEffect, useState } from "react";
import axios from "axios"

export const Home = () => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [investments, setInvestments] = useState([]);

    const username = window.localStorage.getItem("username");

    useEffect(() => {
        const userID = window.localStorage.getItem("userID");
        const fetchIncomes = async () => {
            try{
                //section for incomes
                const incomeResponse = await axios.get(`http://localhost:3001/api/userFinanceByType/${userID}/income`);
                setIncomes(incomeResponse.data);

                //section for expenses
                const expenseResponse = await axios.get(`http://localhost:3001/api/userFinanceByType/${userID}/expense`);
                setExpenses(expenseResponse.data);

                //section for investments
                const investmentResponse = await axios.get(`http://localhost:3001/api/userFinanceByType/${userID}/investment`);
                setInvestments(investmentResponse.data);
            }
            catch(err){
                console.error(err);
            }
        };
        
        fetchIncomes();
    }, []);

    return (
    <div>
        <h2 className="welcomeUser"> Welcome {username}!</h2>
        <h2 className="welcomeUser">Please enter your incomes, expenses, and investments:</h2>
        <UserInput
        setIncomes={setIncomes}
        setExpenses={setExpenses}
        setInvestments={setInvestments}
        />
        <FinanceSummary
        incomes={incomes}
        expenses={expenses}
        investments={investments}
        setIncomes={setIncomes}
        setExpenses={setExpenses}
        setInvestments={setInvestments}
        />
    </div>
    );
}

const UserInput = ({setIncomes, setExpenses, setInvestments}) => {
    const [description, setDescription] = useState("");
    const [value, setValue] = useState("");
    const [financeType, setFinanceType] = useState("income");

    const userID = window.localStorage.getItem("userID");
    
    const onSubmit = async (event) => {
        event.preventDefault();
        try{
            await axios.post("http://localhost:3001/api", {userID, "finances": [{description, value, financeType}]});
            //---------RE-RENDER STUFF--------
            //section for incomes
            const incomeResponse = await axios.get(`http://localhost:3001/api/userFinanceByType/${userID}/income`);
            setIncomes(incomeResponse.data);

            //section for expenses
            const expenseResponse = await axios.get(`http://localhost:3001/api/userFinanceByType/${userID}/expense`);
            setExpenses(expenseResponse.data);

            //section for investments
            const investmentResponse = await axios.get(`http://localhost:3001/api/userFinanceByType/${userID}/investment`);
            setInvestments(investmentResponse.data);
            
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

const FinanceSummary = ({incomes, expenses, investments, setIncomes, setExpenses, setInvestments}) => {
    const userID = window.localStorage.getItem("userID");

    const deleteItem = async (financeID) => {
        try{
            console.log(userID);
            console.log(financeID);
            const response = await axios.delete("http://localhost:3001/api/deleteFinance", {data: {userID, financeID}});
            console.log(response.data);
            //---------RE-RENDER STUFF--------
            //section for incomes
            const incomeResponse = await axios.get(`http://localhost:3001/api/userFinanceByType/${userID}/income`);
            setIncomes(incomeResponse.data);

            //section for expenses
            const expenseResponse = await axios.get(`http://localhost:3001/api/userFinanceByType/${userID}/expense`);
            setExpenses(expenseResponse.data);

            //section for investments
            const investmentResponse = await axios.get(`http://localhost:3001/api/userFinanceByType/${userID}/investment`);
            setInvestments(investmentResponse.data);
        }
        catch(err){
            console.error(err);
        }
    };

    return(
        <div className="financeSummary">
            <div className="incomes finance-section">
                <h3>Incomes:</h3>
                <div className="finance-ul-items">
                    {incomes.map((income) => (
                        <div className="finance-single-item" key={income._id}>
                            <h4>${income.value} from {income.description}</h4>
                            <button className="updateButton">Update</button>
                            <button className="deleteButton" onClick={() => deleteItem(income._id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="expenses finance-section">
                <h3>Expenses</h3>
                <div className="finance-ul-items">
                    {expenses.map((expense) => (
                        <div className="finance-single-item" key={expense._id}>
                            <h4>${expense.value} from {expense.description}</h4>
                            <button className="updateButton">Update</button>
                            <button className="deleteButton" onClick={() => deleteItem(expense._id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="investments finance-section">
                <h3>Investments</h3>
                <div className="finance-ul-items">
                    {investments.map((investment) => (
                        <div className="finance-single-item" key={investment._id}>
                            <h4>${investment.value} from {investment.description}</h4>
                            <button className="updateButton">Update</button>
                            <button className="deleteButton" onClick={() => deleteItem(investment._id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="breakdown finance-section">
                <h3>Breakdown:</h3>
            </div>

        </div>
    );
}