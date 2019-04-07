import React, { useState, useEffect, useRef } from 'react';
import styled  from 'styled-components';
import FontAwesome from 'react-fontawesome';

import CourseItem from './CourseItem';
import ProfessorItem from './ProfessorItem';

export const BACKEND_BASE_URL = 'https://trace.dajinchu.now.sh/backend/api';
export const SEARCH_ITEM_TYPES = {
  PROF: 'prof',
  COURSE: 'course',
}

const SearchPageContainer = styled.div`
`;

const Title = styled.h1`
  font-weight: 500;
  font-size: 64px;
  letter-spacing: .1em;
  text-transform: uppercase;
  padding: 65px 14% 30px;
  line-height: normal;
  color: #fff;
`;

const SearchBarContainer = styled.div`
  margin: 20px 14%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const SearchBar = styled.input`
  border: none;
  /* background-color: ${props => props.visible ? '#C1423E' : '#B12E2A'}; */
  background-color: #C1423E;
  color: #fff;
  font-size: 2em;
  padding: .25em;
  border-radius: 5px;
  margin-left: 5px;
`;

const SearchItemsContainer = styled.div`
  margin: 50px 14%;
  > * {
    margin-bottom: 15px;
  }
`;

const SearchPage = () => {
  const [query, setQuery] = useState('');
  // const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchItems, setSearchItems] = useState([]);


  useEffect(() => {
    fetch(
      `${BACKEND_BASE_URL}/search?q=${query}`,
    ).then(response => {
      response.json().then((data) => {
        setSearchItems(data);
      });
    }).catch(error => console.error(error));
  }, [query]);

  const searchInput = useRef(null);

  const handleInitiateSearch = () => {
    // setIsSearchVisible(true);
    let interval = setInterval(() => {
      if (searchInput.current != null) {
        searchInput.current.focus()
        clearInterval(interval)
      }
    }, 100)
  };

  return (
    <SearchPageContainer>
        <Title>
          SEARCH<br />TRACE.
        </Title>
      <SearchBarContainer>
        <FontAwesome
          name='search'
          size="3x"
          style={{
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: '10px'
          }}
          onClick={handleInitiateSearch}
        />
        {/* {isSearchVisible && */}
          <SearchBar
            type="text"
            ref={searchInput}
            value={query}
            // visible={isSearchVisible}
            // onBlur={() => setIsSearchVisible(false)}
            onChange={e => setQuery(e.target.value)}
          />
        {/* } */}

      </SearchBarContainer>
      <SearchItemsContainer>
        {searchItems.map(searchItem => {
          if (searchItem.type === SEARCH_ITEM_TYPES.PROF) {
            return (
              <ProfessorItem
                key={searchItem.id}
                name={searchItem.name}
                email='matthias@ccs.neu.edu'
                homepage='ccs.neu.edu/home/matthias'
                metrics={searchItem.metrics}
              />
            );
          } else if (searchItem.type === SEARCH_ITEM_TYPES.COURSE) {
            return (
              <CourseItem
                key={searchItem.id}
                name={searchItem.name}
                code={searchItem.code}
                professors={searchItem.profs}
                metrics={searchItem.metrics}
              />
            );
          } else {
            console.error(`Unrecognized search item type "${searchItem.type}".`)
            return null;
          }
        })}
      </SearchItemsContainer>
    </SearchPageContainer>
  );
};

export default SearchPage;
