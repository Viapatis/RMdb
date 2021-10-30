import { FC } from 'react';
import { useAppSelector } from '../store/hooks'
import CharacterItem from './ChracterItem';
import '../styles/CharactersList.css'
interface CharactersListProps {
    title: string;
    showLocation: boolean;
}
const CharactersList: FC<CharactersListProps> = props => {
    const { characters } = useAppSelector(state => state.main);
    const { title, showLocation } = props;
    return (
        <div className='characters'>
            <h2 className='characters-list-title'>{title}</h2>
            <div className='characters-list-main'>
                {characters.map(char => <CharacterItem showLocation={showLocation} list={true} key={`CH${char.id}`} data={char} />)}
            </div>
        </div>
    );
};

export default CharactersList;