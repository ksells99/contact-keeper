import React, {useContext, useRef, useEffect} from 'react';
import ContactContext from '../../context/contact/contactContext';

const ContactFilter = () => {
    const contactContext = useContext(ContactContext);

    const {filterContacts, clearFilter, filtered} = contactContext;

    const text = useRef('');

    useEffect(() => {
        if(filtered === null) {
            text.current.value = '';            // set search form empty
        }
    })

    const onChange = (e) => {
        if(text.current.value !== '') {     // check value of search input
            filterContacts(e.target.value);
        } else {
            clearFilter();
        }
    };

    return (
        <form>
            <input ref={text} type="text" placeholder="Filter contacts..." onChange={onChange}></input>
        </form>
    )
}

export default ContactFilter;
