import './App.css';
import React, { useState, useEffect } from 'react';
import {isNameValid, getLocations} from './mock-api/apis'

const  App = ()=>{
/* 
Here are local states for this component which will help to manage data and rendering on this component
*/
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState('');
  const [tableData, setTableData] = useState([]);
  const [isValid,setIsValid] = useState(true);


 /*
 here is the method for adding location and name in table
 - i use event parameter "e" with function preventDefault to prevent that the page can reload if i click on add button as default behavior
 -then i check the name validity using isNameValid mock api before we add it in table 
 - if name is valid, then it will be added in table, else it won't and error message will be displayed
 - I am using error message in this function, since there is missbehaving of isNameValid mock api due to asynchronous setTimeout with random time to wait,
   and this is misbehaving on onKeyUp event which calls it while user is typing
 */
  const addLocation = async (e) => {
    e.preventDefault();
    const valid  = await isNameValid(name);
    if(valid){
      setTableData([...tableData,{name,location}]);
      setName("");
      setErrorMessage("");
    }else{
      setErrorMessage("this nane has been already taken");
    }
    
  };

  /* here is clear table function which is called when clear button trigger onClick event and empty the table data array state
  which will automaticallty render and clear the data in table */
  const clearTable = () => {
    setTableData([]);
  };
/* 

-here iam using useEffect hook to make sure i fetch locations the moment  the component will mount on page
-then use getLocations mock api to fetch locations, if the data come successfully then i will set them in locations state
 or else if it return the error, i catch it and display the error for better debugging the issue
*/
  useEffect(()=>{
    getLocations()
     .then(locationsData =>{
       setLocations(locationsData);
      })
     .catch(err =>{
       console.log("Error while fetching locations : ",err);
     });     
  },[]);

  /* Here is Validate name which is triggered on key up event so that everytime user type
      - i am using async/await to hadle asyncronous response returned by Promise of validating a name
        to make sure i wait for response before i do checking statement
      - and if isNameValid mock api return false, then i set error message state which will automatically render on page
      -if name is valid then i clear error message accordingly 
  
  */
  const validateName = async (e) => {
        e.preventDefault();
        const valid = await isNameValid(e.target.value);
        setIsValid(valid);
        if(!isValid){
          setErrorMessage("this nane has been already taken");
        }else{
          setErrorMessage("");
        }
  }

  return (
    <div className="App">
    <h1>Name And Location Form</h1>
    <div className="form-container">
      <form onSubmit={addLocation}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onKeyUp= {(e) => validateName(e)}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />
          {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
          {
            locations.map((location,index)=>(
                <option key={index} value={location}>{location}</option>
            ))}
          </select>
        </div>
        <div className="buttons">
          <button type="submit">Add</button>
          <button type="button" onClick={clearTable}>Clear</button>
        </div>
      </form>
    </div>
   
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data, index) => (
            <tr key={index}>
              <td>{data.name}</td>
              <td>{data.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
}

export default App;
