import axios from "axios";
import {React,useState,useEffect} from "react";



const SupermarketSearch = (props) => {

    let title = props.title;
    const [searchValue,setSearchValue] = useState("");
    const [showSearchResult,setShowSearchResult] = useState(false);

    const handleSearch = (event)=>{
        setSearchValue(event.target.value);
        if(event.target.value !== ""){
            setShowSearchResult(true);
            axios.post('http://localhost:5000/api/supermarket/search')
            .then(response=>{
                console.log(response);
            })
        }
        else setShowSearchResult(false);
    }
    
    let search = 
        <>
            <div className="createOffer_txt">{title}</div>
            <div className="createOffer_search">
                <input
                    value={searchValue}
                    placeholder="Search for supermarkets..."
                    onChange={handleSearch}
                                        
                />
            </div>
            <div className="search_results" style={{display:showSearchResult===true ? 'flex' : 'none'}}>

            </div>
        </>

    return (
        <div className="search_container">
            {search}
        </div>
    )
}



export default SupermarketSearch;