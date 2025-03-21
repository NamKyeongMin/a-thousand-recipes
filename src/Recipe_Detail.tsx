import { useEffect, useState } from "react";
import styles from "./Recipe_Main.module.css";
import detailStyle from "./Recipe_Detail.module.css";
import { useParams } from "react-router-dom";

type Recipe = {
  id: number;
  name: string;
  ingredients: string;
  instructions: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
};
type Response<TData> =
  | {
      type: "success";
      data: TData;
    }
  | {
      type: "error";
      message: string;
    };
const API_URL = "https://dummyjson.com";
const api = async <TData,>({
  path,
  method,
  body,
}: {
  path: string;
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: Record<string, unknown>;
}): Promise<Response<TData>> => {
  const response = await fetch(`${API_URL}/${path}`, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    return {
      type: "error",
      message: response.statusText,
    };
  }

  const data = (await response.json()) as TData;
  return {
    type: "success",
    data,
  };
};

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const { id } = useParams();

  const fetchRecipe = () => {
    if (!id) return;

    api<Recipe>({
      path: `recipes/${id}`,
      method: "GET",
    })
      .then((response) => {
        if (response.type === "error") {
          setResponseMessage(response.message);
          return;
        }
        setRecipe(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <header className={styles.title_container}>👩‍🍳 천개의 레시피 🥘</header>
      <span>{responseMessage}</span>
      <div className={styles.recipe_main_container}>
        <div>
          <div>
            <img src={recipe.image} />
          </div>
          <div>
            <div>
              <span>{recipe.name}</span>
              <span>{recipe.difficulty}</span>
            </div>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default RecipeDetail;
