import { useEffect, useState } from "react";
import styles from "./App.module.css";

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

const App = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [responseMessage, setResponseMessage] = useState("");
  const recipesPerPage = 6;
  const LastRecipe = currentPage * recipesPerPage;
  const FirstRecipe = LastRecipe - recipesPerPage;
  const currentPageRecipes = recipes.slice(FirstRecipe, LastRecipe);
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  const fetchRecipe = () => {
    api<{
      recipes: Recipe[];
      total: number;
      skip: number;
      limit: number;
    }>({
      path: "recipes",
      method: "GET",
    })
      .then((response) => {
        if (response.type === "error") {
          setResponseMessage(response.message);
          return;
        }
        setRecipes(response.data.recipes);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchRecipe();
  }, []);

  return (
    <div>
      <header className={styles.title_container}>👩‍🍳 천개의 레시피 🥘</header>
      <span>{responseMessage}</span>
      <div className={styles.recipe_main_container}>
        <div className={styles.recipe_list}>
          {currentPageRecipes.map((recipe) => (
            <div className={styles.recipe_container} key={recipe.id}>
              <div className={styles.recipe_img}>
                <img src={recipe.image} alt="레시피 이미지" />
              </div>
              <div className={styles.recipe_info_container}>
                <div className={styles.recipe_title_top}>
                  <div className={styles.recipe_name}>{recipe.name}</div>
                  <div className={styles.recipe_difficulty}>
                    난이도: {recipe.difficulty}
                  </div>
                </div>
                <div className={styles.recipe_title_bottom}>
                  {recipe.tags.map((tag, index) => (
                    <div key={index} className={styles.recipe_tag}>
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? styles.active : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
