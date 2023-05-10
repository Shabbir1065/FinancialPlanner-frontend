import { useState } from "react";
import axios from "axios"

export const Home = () => {

    return (
    <div>
        <h2>Enter your incomes, expenses, and investments:</h2>
        <UserInput/>
        <FinanceSummary/>
    </div>
    );
}

const UserInput = () => {
    const [description, setDescription] = useState("");
    const [value, setValue] = useState("");
    const [financeType, setFinanceType] = useState("income");

    const userID = window.localStorage.getItem("userID");
    
    const onSubmit = async (event) => {
        event.preventDefault();
        try{
            const response = await axios.post("http://localhost:3001/api", {userID, "finances": [{description, value, financeType}]});
            console.log(response.data);
            alert("Added to the database!"); //MEANT ONLY FOR TESTING. DELETE LATER.
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

const FinanceSummary = () => {
    return(
        <div className="financeSummary">
            <div className="incomes finance-section">
                <h3>Incomes:</h3>
            </div>
            <div className="expenses finance-section">
                <h3>Expenses</h3>
            </div>
            <div className="investments finance-section">
                <h3>Investments</h3>
            </div>
            <div className="breakdown finance-section">
                <h3>Breakdown:</h3>
            </div>

        </div>
    );
}