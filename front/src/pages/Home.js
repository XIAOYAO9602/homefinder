
import React, { useEffect, useState } from 'react';
import ApartmentList from './ApartmentList';
import './style/home.css';
import { Select, Search, Pagination, Button } from 'semantic-ui-react'
import R from '../utils';

{*/ Hi! Overall, I love the look of your website!! Very clean! The tags are very helpful and well selected, as well as a clever idea!
I would just say to make sure your posts are all the same size, because right now it's a bit confusing.*/}
 
export default function Home() {
  const [apts, setApts] = useState([]);
  const [sort, setSort] = useState('');
  const [tag, setTag] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const tags = ['gym', 'pool', 'house', 'apartment', 'pets', 'parking'];
  const aptsPerPage = 12;
  const updateSearch = (search) => {
    if (search.length === 0 || search.length > 2) {
      setSearch(search);
    }
  }

  const onPageChange = (event, data) => {
    const { activePage } = data;
    setCurrentPage(activePage);
  }

  const filterByTags = (tag) => {
    setTag(tag);
  }

  useEffect(() => {
    const getApts = async () => {
      const res = await fetch('./api/apts');
      const apts = await res.json();
      const taggedApts = apts.map(apt => {
        apt.tags = R(tags, 3);
        return apt;
      })
      setApts(taggedApts);
    }
    getApts();
  }, [])

  let finalApts = apts;
  if (sort) {
    if (sort === 'low') {
      finalApts = apts.sort((a, b) => {

        if (a.price && b.price) {
          const price1 = parseInt(a.price.replace(/\$|,/g, ""));
          const price2 = parseInt(b.price.replace(/\$|,/g, ""));
          return price1 > price2 ? 1 : -1;
        }
        return 0;

      })
    } else {
      finalApts = apts.sort((a, b) => {
        if (a.price && b.price) {
          const price1 = parseInt(a.price.replace(/\$|,/g, ""));
          const price2 = parseInt(b.price.replace(/\$|,/g, ""));
          return price1 < price2 ? 1 : -1;
        }
        return 0;
      })
    }
  }
  const sortOptions = [
    { key: 'af', value: 'low', text: 'Low to High' },
    { key: 'ax', value: 'high', text: 'High to Low' },
  ]

  // Search activates when search length is greater than 2 to prevent false searches
  if (search.length === 0 || search.length > 2) {
    finalApts = finalApts.filter(apt => {
      if (apt.neighborhood) {
        return apt.neighborhood.toLowerCase().includes(search)
      }
      return false;

    });
  }

  if (tag) {
    finalApts = finalApts.filter(apt => apt.tags.includes(tag));
  }

  const totalPages = Math.ceil(finalApts.length / 12);
  finalApts = finalApts.slice(currentPage * aptsPerPage - 12, currentPage * aptsPerPage);

  return (
    <div>
      <h1 className="home-title">Find Your Home at Home Finder</h1>
      <div className="filter-container">
        <Search
          className="search"
          showNoResults={false}
          onSearchChange={e => updateSearch(e.target.value)}
        />
        <Select className="select" placeholder='Sort by Price' options={sortOptions} onChange={(e, data) => setSort(data.value)} />
        {tags.map(currTag => (
          <Button key={currTag} active={currTag === tag} onClick={() => filterByTags(currTag)}>{currTag}</Button>
        ))}
      </div>

      <ApartmentList apts={finalApts.slice(0, 12)} />
      {finalApts.length > 0 && (
        <div className="pagination-container">
          <Pagination
            defaultActivePage={1}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
