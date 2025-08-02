import React, { JSX } from 'react';
import styles from './Card.module.css';
import { usePokemonStore } from '../../store/pokemonStore';

interface CardProps {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

function Card({ id, name, description, imageUrl }: CardProps): JSX.Element {
  const { selectedPokemons, addItem, removeItem } = usePokemonStore();
  const isChecked = selectedPokemons.some((pokemon) => pokemon.id === id);

  const handleCheckboxChange = () => {
    const pokemon = {
      id,
      name,
      url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
      types: [
        { type: { name: description.split('Type: ')[1].split(', ')[0] } },
      ],
    };
    if (isChecked) {
      removeItem(id);
    } else {
      addItem(pokemon);
    }
  };

  return (
    <div className={styles.card}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className={styles.checkbox}
      />
      <img src={imageUrl} alt={name} className={styles.image} />
      <h2 className={styles.title}>{name}</h2>
      <p className={styles.description}>{description}</p>
    </div>
  );
}

export default Card;
