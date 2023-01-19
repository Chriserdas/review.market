import {React,useState,useEffect} from "react";



const SupermarketSearch = (props) => {

    let title = props.title;
    const [searchValue,setSearchValue] = useState("");


    const handleSearch = (event)=>{
        setSearchValue(event.target.value);
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
        </>

    return (
        <div className="search_container">
            {search}
        </div>
    )
}



export default SupermarketSearch;