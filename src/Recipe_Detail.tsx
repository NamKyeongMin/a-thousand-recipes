import { useEffect, useState } from "react";
import styles from "./Recipe_Main.module.css";
import detailStyle from "./Recipe_Detail.module.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

type Recipe = {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
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
  const navigate = useNavigate();

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
      <div className={detailStyle.recipe_main_container}>
        <button
          className={detailStyle.detail_homeBtn}
          onClick={() => navigate(`/`)}
        >
          Home
        </button>
        <div className={detailStyle.recipe_main_info}>
          <div className={detailStyle.image_container}>
            <img src={recipe.image} />
          </div>
          <div className={detailStyle.recipe_main_info_top}>
            <div className={detailStyle.recipe_nameBox}>
              <span className={detailStyle.recipe_name}>{recipe.name}</span>
              <span className={detailStyle.recipe_difficulty}>
                {recipe.difficulty}
              </span>
            </div>
            <span className={detailStyle.recipe_total_time}>
              총 요리시간 {recipe.prepTimeMinutes + recipe.cookTimeMinutes}분
            </span>
            <span>준비시간 {recipe.prepTimeMinutes}분</span>
            <span>조리시간 {recipe.cookTimeMinutes}분</span>
            <div className={detailStyle.recipe_tag_container}>
              {recipe.tags.map((tag, index) => (
                <div key={index} className={detailStyle.recipe_tagBox}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={detailStyle.recipe_ingredients_container}>
          <h3>필요한 재료</h3>
          <span>{recipe.ingredients.join(" | ")}</span>
        </div>
        <div className={detailStyle.recipe_instructions_container}>
          <h3>레시피</h3>
          <ol>
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
        <div className={detailStyle.recipe_extra_container}>
          <h3>요리정보</h3>
          <span>유형: {recipe.cuisine}</span>
          <span>음식특징: {recipe.mealType.join(", ")}</span>
          <span>칼로리: {recipe.caloriesPerServing}</span>
          <span>평균 만족도: {recipe.rating}</span>
          <span>리뷰 작성 수: {recipe.reviewCount}</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
