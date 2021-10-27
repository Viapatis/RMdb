import { FC } from 'react';
import { useAppSelector } from '../store/hooks'
import CharactersItem from './ChracterItem';
import '../styles/CharactersList.css'
const CharactersList: FC<{}> = props => {
    const { characters } = useAppSelector(state => state.main)
    return (
        <div className='characters'>
            {characters.map(char => <CharactersItem list={true} key={`CH${char.id}`} data={char} />)}
        </div>
    );
};

export default CharactersList;