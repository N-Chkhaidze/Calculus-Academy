import { LessonTopic, QuizSet, BadgeDefinition, ReferenceSource } from './types';

export const LESSON_TOPICS: LessonTopic[] = [
  {
    id: 'limits',
    index: 0,
    titleGe: 'Limits',
    titleEn: 'Limits',
    taglineGe: 'What happens when we get infinitely close to a point?',
    taglineEn: 'What happens as we get infinitely close?',
    descriptionGe: 'A fundamental concept of calculus that helps us understand the behavior of a function when approaching a specific point infinitely close, even if the function itself is not defined at that point.',
    unlockedAtPoints: 0,
    icon: 'Percent',
    colorClass: 'stroke-rose-500 bg-rose-50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30',
    gradientClass: 'from-rose-500 to-orange-500'
  },
  {
    id: 'derivatives',
    index: 1,
    titleGe: 'Derivatives',
    titleEn: 'Derivatives',
    taglineGe: 'Instantaneous rate of change (tangent slope)',
    taglineEn: 'The instantaneous rate of change (slope)',
    descriptionGe: 'The process of finding how fast a quantity changes with respect to time or another parameter. Geometrically, this is nothing other than the slope of the tangent line drawn to the function\'s graph.',
    unlockedAtPoints: 30, // Requires completing limits quiz with 30 pts
    icon: 'TrendingUp',
    colorClass: 'stroke-indigo-500 bg-indigo-50 border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/30',
    gradientClass: 'from-indigo-500 to-cyan-500'
  },
  {
    id: 'integrals',
    index: 2,
    titleGe: 'Integrals',
    titleEn: 'Integrals',
    taglineGe: 'Area under the curve and the art of accumulation',
    taglineEn: 'The area under the curve and the art of accumulation',
    descriptionGe: 'The inverse operation of differentiation that helps us find the total accumulated quantity or the area under a curve. Integration is the key to measuring space and volume.',
    unlockedAtPoints: 60, // Requires completing limits and derivatives
    icon: 'Layers',
    colorClass: 'stroke-emerald-500 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30',
    gradientClass: 'from-emerald-500 to-teal-500'
  }
];

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'calculus_novice',
    titleGe: 'Calculus Debutant',
    descriptionGe: 'Sign up and begin your mathematical adventure.',
    iconName: 'Award',
    colorClass: 'text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/30'
  },
  {
    id: 'limits_master',
    titleGe: 'Limits Master',
    descriptionGe: 'Successfully completed the Limits quiz with a perfect score.',
    iconName: 'Compass',
    colorClass: 'text-rose-500 border-rose-200 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-900/30'
  }  ,
  {
    id: 'derivatives_master',
    titleGe: 'Derivatives Conqueror',
    descriptionGe: 'Successfully completed the Derivatives quiz with a perfect score.',
    iconName: 'TrendingUp',
    colorClass: 'text-indigo-500 border-indigo-200 bg-indigo-50 dark:bg-indigo-950/20 dark:border-indigo-900/30'
  },
  {
    id: 'integrals_master',
    titleGe: 'Professor of Integrals',
    descriptionGe: 'Successfully completed the Integrals quiz with a perfect score.',
    iconName: 'Layers',
    colorClass: 'text-emerald-500 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900/30'
  },
  {
    id: 'perfect_score',
    titleGe: 'Mathematical Genius',
    descriptionGe: 'Accumulate more than 90 XP in total and become an academy leader.',
    iconName: 'Sparkles',
    colorClass: 'text-purple-500 border-purple-200 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-900/30'
  }
];

export const QUIZ_SETS: QuizSet[] = [
  {
    topicId: 'limits',
    questions: [
      {
        id: 'lim_q1',
        questionTextGe: 'What does the limit lim (x → 2) (3x + 1) represent?',
        optionsGe: [
          'The exact value of the function at x = 2',
          'The value that 3x + 1 approaches as x infinitely approaches 2',
          'The derivative of the function at x = 2',
          'The area under the curve up to x = 2'
        ],
        correctIndex: 1,
        explanationGe: 'A limit describes the behavior of a function near a given point, not directly at the point. As x approaches 2, 3x+1 approaches 3(2)+1=7.'
      },
      {
        id: 'lim_q2',
        questionTextGe: 'Calculate the limit: lim (x → 3) (x² - 9) / (x - 3).',
        optionsGe: [
          'Indeterminate (0 / 0)',
          '3',
          '6',
          '9'
        ],
        correctIndex: 2,
        explanationGe: 'This is a 0/0 indeterminate form. The numerator factors into: (x-3)(x+3). The (x-3) terms cancel out, leaving lim (x → 3) (x + 3), which equals 3 + 3 = 6.'
      },
      {
        id: 'lim_q3',
        questionTextGe: 'What is the limit at infinity: lim (x → ∞) (2x + 5) / (x - 1)?',
        optionsGe: [
          '0',
          '1',
          '2',
          'Infinity (∞)'
        ],
        correctIndex: 2,
        explanationGe: 'When x approaches infinity, the behavior of the fraction is determined by the highest-degree terms. The ratio of the leading coefficients of the numerator and denominator is: 2 / 1 = 2.'
      },
      {
        id: 'lim_q4',
        questionTextGe: 'Calculate the limit: lim (x → 0) (sin(x) / x).',
        optionsGe: [
          '0',
          '1',
          'Indeterminate',
          'Does not exist'
        ],
        correctIndex: 1,
        explanationGe: 'This is a fundamental limit in calculus. As x approaches 0, the ratio of sin(x) to x approaches exactly 1. This can be proven using the Squeeze Theorem or L’Hôpital’s Rule.'
      },
      {
        id: 'lim_q5',
        questionTextGe: 'What is lim (x → 0) (1 - cos(x)) / x?',
        optionsGe: [
          '0',
          '1',
          '1/2',
          'Infinity'
        ],
        correctIndex: 0,
        explanationGe: 'Applying L’Hôpital’s Rule or trigonometric identities, we differentiate the numerator to get sin(x) and the denominator to get 1. Evaluating as x → 0 gives sin(0)/1 = 0.'
      },
      {
        id: 'lim_q6',
        questionTextGe: 'Evaluate the limit: lim (x → 2) (x² - 4) / (x² - x - 2).',
        optionsGe: [
          '0',
          '4/3',
          '1',
          'Does not exist'
        ],
        correctIndex: 1,
        explanationGe: 'Factor the numerator into (x - 2)(x + 2) and the denominator into (x - 2)(x + 1). Cancel the common factor (x - 2) to get lim (x → 2) (x + 2) / (x + 1) = (2 + 2) / (2 + 1) = 4/3.'
      },
      {
        id: 'lim_q7',
        questionTextGe: 'Evaluate the limit at infinity: lim (x → ∞) (3x³ - x + 2) / (5x³ + 2x² - 1).',
        optionsGe: [
          '0',
          '3/5',
          'Infinity',
          '3'
        ],
        correctIndex: 1,
        explanationGe: 'For limits at infinity of rational functions of equal degrees, the limit is the ratio of their leading coefficients. Here, the ratio is 3/5.'
      },
      {
        id: 'lim_q8',
        questionTextGe: 'What is the limit: lim (x → 4) (√(x) - 2) / (x - 4)?',
        optionsGe: [
          '1/4',
          '1/2',
          '0',
          'Indeterminate'
        ],
        correctIndex: 0,
        explanationGe: 'Multiply numerator and denominator by the conjugate (√(x) + 2), or factor the denominator as (√(x) - 2)(√(x) + 2). Canceling (√(x) - 2) leaves 1 / (√(x) + 2). As x → 4, this becomes 1 / (2 + 2) = 1/4.'
      },
      {
        id: 'lim_q9',
        questionTextGe: 'Find the limit: lim (x → ∞) (1 + 1/x)^x.',
        optionsGe: [
          '1',
          'Infinity',
          'e (Euler’s number)',
          '0'
        ],
        correctIndex: 2,
        explanationGe: 'This is the classic definition of the mathematical constant e (approximately 2.71828), which describes continuous compounding and exponential growth.'
      },
      {
        id: 'lim_q10',
        questionTextGe: 'If a function f(x) has a vertical asymptote at x = c, what must be true about the limit lim (x → c) f(x)?',
        optionsGe: [
          'The limit is equal to f(c)',
          'The limit is 0',
          'The limit approaches infinity or negative infinity (±∞)',
          'The limit is 1'
        ],
        correctIndex: 2,
        explanationGe: 'A vertical asymptote at x = c means the function values grow without bound (approach ±∞) as x gets closer to c from at least one side.'
      }
    ]
  },
  {
    topicId: 'derivatives',
    questions: [
      {
        id: 'der_q1',
        questionTextGe: 'What does the derivative of a function at a given point geometrically represent?',
        optionsGe: [
          'The area under the graph of the function',
          'The slope of the tangent line drawn to the graph',
          'The maximum point of the function',
          'The distance from the origin of coordinates to the point'
        ],
        correctIndex: 1,
        explanationGe: 'The derivative f\'(x) geometrically defines the slope of the tangent line drawn at the given point.'
      },
      {
        id: 'der_q2',
        questionTextGe: 'Find the derivative of the function f(x) = x³ - 4x + 7 using the Power Rule.',
        optionsGe: [
          '3x²',
          '3x² - 4',
          'x² - 4',
          '3x² - 4x'
        ],
        correctIndex: 1,
        explanationGe: 'According to the power rule, (x³)\' = 3x², and (-4x)\' = -4. The derivative of a constant number is zero: (7)\' = 0. As a result, we get 3x² - 4.'
      },
      {
        id: 'der_q3',
        questionTextGe: 'The equation of motion of a body is S(t) = t² + 2t. Find the speed of the body at t = 3 seconds (speed is the derivative of distance with respect to time).',
        optionsGe: [
          '5 m/s',
          '8 m/s',
          '11 m/s',
          '3 m/s'
        ],
        correctIndex: 1,
        explanationGe: 'The speed is v(t) = S\'(t) = 2t + 2. When t = 3, v(3) = 2(3) + 2 = 8 m/s.'
      },
      {
        id: 'der_q4',
        questionTextGe: 'Using the Chain Rule, what is the derivative of f(x) = sin(x²)?',
        optionsGe: [
          'cos(x²)',
          '2x * cos(x²)',
          '2 * sin(x)',
          '-2x * cos(x²)'
        ],
        correctIndex: 1,
        explanationGe: 'According to the chain rule, you take the derivative of the outer function sin(u) which is cos(u), and multiply it by the derivative of the inner function u = x² which is 2x. Thus, the derivative is 2x * cos(x²).'
      },
      {
        id: 'der_q5',
        questionTextGe: 'What is the derivative of the natural log function f(x) = ln(x) for x > 0?',
        optionsGe: [
          '1/x',
          'e^x',
          '1',
          'x * ln(x) - x'
        ],
        correctIndex: 0,
        explanationGe: 'The derivative of ln(x) is one of the fundamental derivative formulas in calculus, equal to 1/x.'
      },
      {
        id: 'der_q6',
        questionTextGe: 'Calculate the derivative of f(x) = 5e^x + x².',
        optionsGe: [
          '5e^x + 2x',
          '5xe^(x-1) + 2x',
          'e^x + 2x',
          '5e^x'
        ],
        correctIndex: 0,
        explanationGe: 'The derivative of e^x is e^x, so (5e^x)\' = 5e^x. The derivative of x² is 2x. Summing them yields 5e^x + 2x.'
      },
      {
        id: 'der_q7',
        questionTextGe: 'Use the Product Rule to find the derivative of f(x) = x * ln(x).',
        optionsGe: [
          '1/x',
          'ln(x)',
          'ln(x) + 1',
          'x / ln(x)'
        ],
        correctIndex: 2,
        explanationGe: 'The product rule states that (u*v)\' = u\'v + uv\'. Let u = x and v = ln(x). Then u\' = 1 and v\' = 1/x. This yields (1)*ln(x) + x*(1/x) = ln(x) + 1.'
      },
      {
        id: 'der_q8',
        questionTextGe: 'At a local maximum or local minimum of a differentiable function f(x), what is the value of f\'(x)?',
        optionsGe: [
          '0',
          '1',
          'Infinity',
          'It can be any positive number'
        ],
        correctIndex: 0,
        explanationGe: 'Fermat\'s Theorem states that if f(x) has a local extremum and is differentiable there, then f\'(x) must equal 0. These are called critical points.'
      },
      {
        id: 'der_q9',
        questionTextGe: 'What is the derivative of f(x) = cos(x)?',
        optionsGe: [
          'sin(x)',
          '-sin(x)',
          '-cos(x)',
          'sec²(x)'
        ],
        correctIndex: 1,
        explanationGe: 'The rate of change of the cosine function is the negative of the sine function. Therefore, (cos(x))\' = -sin(x).'
      },
      {
        id: 'der_q10',
        questionTextGe: 'Find the second derivative of f(x) = x³ - 5x.',
        optionsGe: [
          '3x² - 5',
          '6x',
          '6',
          '3x'
        ],
        correctIndex: 1,
        explanationGe: 'The first derivative is f\'(x) = 3x² - 5. Differentiating once more, the second derivative is f\'\'(x) = (3x² - 5)\' = 6x.'
      }
    ]
  },
  {
    topicId: 'integrals',
    questions: [
      {
        id: 'int_q1',
        questionTextGe: 'What does the definite integral ∫(from a to b) f(x) dx show when f(x) ≥ 0?',
        optionsGe: [
          'The slope of the function\'s graph in the interval [a, b]',
          'The area bounded by the curve in the interval [a, b] on the abscissa axis',
          'The average value of the function on the y-axis',
          'The constant of integration (C)'
        ],
        correctIndex: 1,
        explanationGe: 'A definite integral geometrically represents the area located between the graph of the function f(x) and the x-axis within the boundaries from a to b.'
      },
      {
        id: 'int_q2',
        questionTextGe: 'Find the indefinite integral: ∫ 2x dx.',
        optionsGe: [
          '2',
          'x² + C',
          '2x² + C',
          'x + C'
        ],
        correctIndex: 1,
        explanationGe: 'Finding the antiderivative means finding a function whose derivative is equal to 2x. Since (x² + C)\' = 2x, the answer is x² + C.'
      },
      {
        id: 'int_q3',
        questionTextGe: 'Calculate the definite integral: ∫ (from 1 to 3) 3x² dx using the Newton-Leibniz formula.',
        optionsGe: [
          '26',
          '27',
          '8',
          '24'
        ],
        correctIndex: 0,
        explanationGe: 'The antiderivative of 3x² is F(x) = x³. Using the Newton-Leibniz formula, we have F(3) - F(1) = 3³ - 1³ = 27 - 1 = 26.'
      },
      {
        id: 'int_q4',
        questionTextGe: 'Find the indefinite integral: ∫ e^x dx.',
        optionsGe: [
          'e^x + C',
          'x * e^(x-1) + C',
          '1/x + C',
          'e^x'
        ],
        correctIndex: 0,
        explanationGe: 'The exponential function e^x is unique because it is its own derivative and its own antiderivative. Adding the integration constant C gives e^x + C.'
      },
      {
        id: 'int_q5',
        questionTextGe: 'What is the value of the definite integral ∫ (from 0 to π) sin(x) dx?',
        optionsGe: [
          '0',
          '1',
          '2',
          '-2'
        ],
        correctIndex: 2,
        explanationGe: 'The antiderivative of sin(x) is -cos(x). Using the Newton-Leibniz formula, we have [-cos(π)] - [-cos(0)] = [-(-1)] - [-1] = 1 + 1 = 2.'
      },
      {
        id: 'int_q6',
        questionTextGe: 'Calculate the indefinite integral: ∫ 1/x dx (for x > 0).',
        optionsGe: [
          '-1/x² + C',
          'ln(x) + C',
          '1 + C',
          'ln|x|'
        ],
        correctIndex: 1,
        explanationGe: 'Since the derivative of ln(x) is 1/x, the antiderivative of 1/x is ln(x) + C (or ln|x| + C for general non-zero x).'
      },
      {
        id: 'int_q7',
        questionTextGe: 'Evaluate the definite integral: ∫ (from 0 to 2) (3x² - 2x) dx.',
        optionsGe: [
          '4',
          '6',
          '8',
          '2'
        ],
        correctIndex: 0,
        explanationGe: 'The antiderivative is F(x) = x³ - x². Evaluating F(2) - F(0) gives (2³ - 2²) - (0) = (8 - 4) - 0 = 4.'
      },
      {
        id: 'int_q8',
        questionTextGe: 'What integration technique is considered the reverse of the Chain Rule of differentiation?',
        optionsGe: [
          'Integration by Parts',
          'u-Substitution',
          'Partial Fractions',
          'Trigonometric Substitution'
        ],
        correctIndex: 1,
        explanationGe: 'u-substitution is used to simplify integrals by replacing a composite function and its derivative with u and du, reversing the chain rule.'
      },
      {
        id: 'int_q9',
        questionTextGe: 'What is the formula for Integration by Parts, which reverses the product rule?',
        optionsGe: [
          '∫ u dv = uv - ∫ v du',
          '∫ u dv = u\'v + uv\'',
          '∫ u dv = uv + ∫ v du',
          '∫ u dv = u/v'
        ],
        correctIndex: 0,
        explanationGe: 'Integration by Parts is based on the product rule of differentiation and is written as ∫ u dv = uv - ∫ v du.'
      },
      {
        id: 'int_q10',
        questionTextGe: 'If a definite integral ∫ (from -k to k) f(x) dx equals 0 for any k > 0, what type of function must f(x) be?',
        optionsGe: [
          'An even function',
          'An odd function',
          'A constant function',
          'An exponential function'
        ],
        correctIndex: 1,
        explanationGe: 'For an odd function, f(-x) = -f(x). The area under the curve on the negative x-axis perfectly cancels out the area on the positive x-axis, resulting in a net integral of 0.'
      }
    ]
  }
];

export const REFERENCE_SOURCES: ReferenceSource[] = [
  {
    title: 'Calculus (Early Transcendentals)',
    category: 'Books',
    author: 'James Stewart',
    link: 'https://www.stewartcalculus.com/',
    descriptionGe: 'One of the most famous and well-established textbooks in the world, perfectly explaining limits, derivatives, and integrals with real-world examples.'
  },
  {
    title: 'MIT OpenCourseWare - Single Variable Calculus',
    category: 'Websites',
    author: 'Professor David Jerison (MIT)',
    link: 'https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/',
    descriptionGe: 'MIT\'s free lecture course, where video lectures, problem sets, and exam materials are available to everyone.'
  },
  {
    title: 'Calculus Basics - Khan Academy',
    category: 'Websites',
    author: 'Salman Khan',
    link: 'https://ka.khanacademy.org/math/calculus-home',
    descriptionGe: 'An interactive platform that teaches higher mathematics step-by-step through simple exercises.'
  },
  {
    title: 'Paul’s Online Math Notes',
    category: 'Websites',
    author: 'Paul Dawkins (Lamar University)',
    link: 'https://tutorial.math.lamar.edu/',
    descriptionGe: 'One of the best online math outlines full of interactive examples, derivation rules, and practical exercises.'
  },
  {
    title: 'Derivatives and Integrals in Modern Science & Machine Learning',
    category: 'Research',
    author: 'Stanford Academic Papers',
    link: 'https://cs229.stanford.edu/section/cs229-linalg.pdf',
    descriptionGe: 'Scientific paper and materials about how modern artificial intelligence uses backpropagation and calculus rules when scaling neural networks.'
  }
];
