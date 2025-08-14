// src/lib/curriculum.ts
import { dashboardData } from '../dashboardData';

export const MATH_CURRICULUM: any = {
    // Grade 3-4 Level
    "level-1": {
        "displayName": "Level 1: Arithmetic Foundations",
        "description": "Mastering the core operations of numbers.",
        "skills": [
            {
                "skillId": "place-value",
                "displayName": "Place Value",
                "example": "In the number 4,285, the '2' represents two hundreds, or 200.",
            },
            {
                "skillId": "rounding-numbers",
                "displayName": "Rounding Numbers",
                "example": "To round 37 to the nearest ten, we look at the '7'. Since it's 5 or more, we round up to 40.",
            },
            {
                "skillId": "multi-digit-addition",
                "displayName": "Multi-Digit Addition",
                "example": "To solve 125 + 43, stack them vertically. 5+3=8, 2+4=6, 1+0=1. The answer is 168.",
            },
            {
                "skillId": "multi-digit-subtraction",
                "displayName": "Multi-Digit Subtraction",
                "example": "To solve 86 - 21, stack them vertically. 6-1=5, 8-2=6. The answer is 65.",
            },
            {
                "skillId": "basic-multiplication",
                "displayName": "Basic Multiplication",
                "example": "7 x 8 means adding 7 eight times, or 8 seven times. The answer is 56.",
            },
            {
                "skillId": "basic-division",
                "displayName": "Basic Division",
                "example": "24 ÷ 6 asks how many times 6 fits into 24. The answer is 4.",
            },
            {
                "skillId": "order-of-operations",
                "displayName": "Order of Operations (PEMDAS)",
                "example": "In 2 + 3 x 4, you do Multiplication first (3x4=12), then Addition (2+12=14).",
            },
        ]
    },
    // Grade 5-6 Level
    "level-2": {
        "displayName": "Level 2: Mastering Fractions & Decimals",
        "description": "Understanding parts of a whole and their operations.",
        "skills": [
            {
                "skillId": "lcm",
                "displayName": "Least Common Multiple (LCM)",
                "example": "The multiples of 4 are 4, 8, 12... The multiples of 6 are 6, 12... The LCM is 12.",
            },
            {
                "skillId": "gcd",
                "displayName": "Greatest Common Divisor (GCD)",
                "example": "The divisors of 12 are 1,2,3,4,6,12. The divisors of 18 are 1,2,3,6,9,18. The GCD is 6.",
            },
            {
                "skillId": "adding-subtracting-fractions",
                "displayName": "Add & Subtract Fractions",
                "example": "To solve 1/3 + 1/4, find a common denominator (12). 4/12 + 3/12 = 7/12.",
            },
            {
                "skillId": "multiplying-fractions",
                "displayName": "Multiply Fractions",
                "example": "To solve 2/3 x 4/5, multiply the numerators (2x4=8) and the denominators (3x5=15). Answer: 8/15.",
            },
            {
                "skillId": "dividing-fractions",
                "displayName": "Divide Fractions",
                "example": "To solve 1/2 ÷ 3/4, 'keep, change, flip': 1/2 x 4/3 = 4/6, which simplifies to 2/3.",
            },
            {
                "skillId": "fractions-to-decimals",
                "displayName": "Fractions to Decimals",
                "example": "To convert 3/4 to a decimal, divide the numerator by the denominator: 3 ÷ 4 = 0.75.",
            },
            {
                "skillId": "adding-subtracting-decimals",
                "displayName": "Add & Subtract Decimals",
                "example": "To solve 1.25 + 0.5, line up the decimal points: 1.25 + 0.50 = 1.75.",
            },
            {
                "skillId": "multiplying-decimals",
                "displayName": "Multiply Decimals",
                "example": "To solve 1.5 x 2, ignore decimals (15x2=30), then add back one decimal place. Answer: 3.0.",
            },
        ]
    },
    // Grade 6-7 Level
    "level-3": {
        "displayName": "Level 3: Ratios, Percents & Pre-Algebra",
        "description": "Applying mathematical concepts to real-world scenarios.",
        "skills": [
            {
                "skillId": "exponents-intro",
                "displayName": "Exponents Introduction",
                "example": "5³ means 5 x 5 x 5. The base is 5, the exponent is 3. The answer is 125.",
            },
            {
                "skillId": "percents",
                "displayName": "Percents",
                "example": "To find 25% of 80, convert the percent to a decimal (0.25) and multiply: 0.25 x 80 = 20.",
            },
            {
                "skillId": "simplifying-expressions",
                "displayName": "Simplifying Expressions",
                "example": "To simplify 3x + 2 + 5x, combine 'like terms': (3x + 5x) + 2 = 8x + 2.",
            },
            {
                "skillId": "one-step-equations",
                "displayName": "One-Step Equations",
                "example": "To solve x + 7 = 12, do the opposite of '+7' to both sides: x = 12 - 7, so x = 5.",
            },
        ]
    },
    // Grade 8 Level
    "level-4": {
        "displayName": "Level 4: Foundations of Algebra",
        "description": "Working with variables, equations, and graphs.",
        "skills": [
            {
                "skillId": "two-step-equations",
                "displayName": "Two-Step Equations",
                "example": "To solve 2x + 5 = 19, first subtract 5 (2x=14), then divide by 2 (x=7).",
            },
            {
                "skillId": "graphing-linear-equations",
                "displayName": "Graphing Linear Equations",
                "example": "For y = 2x + 1, the y-intercept is 1. From there, the slope '2' means 'up 2, right 1'.",
            },
            {
                "skillId": "slope-from-two-points",
                "displayName": "Slope from Two Points",
                "example": "For points (1,2) and (3,6), slope is (change in y)/(change in x) = (6-2)/(3-1) = 4/2 = 2.",
            },
            {
                "skillId": "data-mean-median-mode",
                "displayName": "Mean, Median, Mode",
                "example": "For the set {2, 3, 3, 5, 7}, the Mean is the average, Median is the middle (3), and Mode is most frequent (3).",
            },
        ]
    },
    // Grade 9-10 Level (Algebra 1 / Geometry)
    "level-5": {
        "displayName": "Level 5: Intermediate Algebra & Geometry",
        "description": "Deepening algebraic skills and understanding geometric principles.",
        "skills": [
            {
                "skillId": "systems-of-equations",
                "displayName": "Systems of Equations",
                "example": "Given y=2x+1 and y=3x, set them equal: 2x+1=3x. Solve for x (x=1), then find y (y=3).",
            },
            {
                "skillId": "exponent-rules",
                "displayName": "Exponent Rules",
                "example": "x³ * x⁴ = x⁽³⁺⁴⁾ = x⁷. (x³)⁴ = x⁽³*⁴⁾ = x¹².",
            },
            {
                "skillId": "prime-factorization",
                "displayName": "Prime Factorization",
                "example": "The prime factorization of 12 is 2 x 2 x 3, or 2² x 3.",
            },
            {
                "skillId": "square-roots",
                "displayName": "Simplifying Square Roots",
                "example": "To simplify √50, find the largest perfect square factor: √(25 * 2) = √25 * √2 = 5√2.",
            },
            {
                "skillId": "point-slope-form",
                "displayName": "Point-Slope Form",
                "example": "An equation for a line with slope 3 passing through (2,5) is y - 5 = 3(x - 2).",
            },
        ]
    },
    // Grade 11 Level (Algebra 2)
    "level-6": {
        "displayName": "Level 6: Advanced Algebra",
        "description": "Mastering polynomials and complex functions.",
        "skills": [
            {
                "skillId": "factoring-trinomials",
                "displayName": "Factoring Trinomials",
                "example": "To factor x² + 5x + 6, find two numbers that multiply to 6 and add to 5. They are 2 and 3. Factored form: (x + 2)(x + 3).",
            },
            {
                "skillId": "quadratic-formula",
                "displayName": "The Quadratic Formula",
                "example": "For ax²+bx+c=0, x = [-b ± √(b²-4ac)] / 2a. This solves for x even when factoring is difficult.",
            },
            {
                "skillId": "completing-the-square",
                "displayName": "Completing the Square",
                "example": "To solve x²+6x=7, take half of 6 (3), square it (9), and add to both sides: x²+6x+9=16. This becomes (x+3)²=16.",
            },
            {
                "skillId": "function-transformations",
                "displayName": "Function Transformations",
                "example": "Compared to f(x)=x², g(x)=(x-3)²+5 is shifted 3 units right and 5 units up.",
            },
        ]
    },
    // Grade 12 Level (Pre-Calculus)
    "level-7": {
        "displayName": "Level 7: Pre-Calculus Concepts",
        "description": "Preparing for the mathematics of change and motion.",
        "skills": [
            {
                "skillId": "function-domain-range",
                "displayName": "Domain and Range",
                "example": "For f(x)=√x, the Domain (valid inputs) is x≥0. The Range (possible outputs) is y≥0.",
            },
            {
                "skillId": "logarithms",
                "displayName": "Logarithms",
                "example": "log₂(8) asks '2 to what power equals 8?'. The answer is 3.",
            },
            {
                "skillId": "trigonometry-unit-circle",
                "displayName": "Trigonometry & The Unit Circle",
                "example": "On the unit circle, the coordinates (x,y) correspond to (cosθ, sinθ). At 90°, the point is (0,1), so cos(90°)=0 and sin(90°)=1.",
            },
            {
                "skillId": "matrix-operations",
                "displayName": "Matrix Operations",
                "example": "To add two matrices, add the corresponding elements. The matrices must have the same dimensions.",
            },
        ]
    }
};

/**
 * A helper to find the icon URL for a given levelId.
 * @param levelId e.g., "level-1"
 * @returns The icon URL string or an empty string if not found.
 */
export const getLevelIcon = (levelId: string): string => {
  const mathPath = dashboardData.find(path => path.id === 'foundational-math');
  if (!mathPath || !mathPath.levels) return '';
  
  const level = mathPath.levels.find(l => l.path.endsWith(levelId));
  return level ? level.image : '';
};