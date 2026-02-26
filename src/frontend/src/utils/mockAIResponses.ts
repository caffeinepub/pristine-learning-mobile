export type AIToolType =
  | 'worksheet'
  | 'quiz'
  | 'lessonPlan'
  | 'questionPaper'
  | 'rubric'
  | 'teachingStrategies';

export interface AIToolInput {
  grade: string;
  subject: string;
  difficulty: string;
  topic: string;
}

export function generateMockAIResponse(tool: AIToolType, input: AIToolInput): string {
  const { grade, subject, difficulty, topic } = input;
  const diffLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  switch (tool) {
    case 'worksheet':
      return `# ${subject} Worksheet — ${topic}
**Grade:** ${grade} | **Difficulty:** ${diffLabel}

---

## Section A: Fill in the Blanks (10 marks)
1. _____________ is defined as _________________________.
2. The main components of ${topic} include _____________ and _____________.
3. When we apply ${topic} in real life, we see _________________________.
4. The formula/rule for ${topic} is _________________________.
5. An example of ${topic} in ${subject} is _________________________.

## Section B: Short Answer Questions (15 marks)
1. Explain the concept of ${topic} in your own words. (3 marks)
2. List three key characteristics of ${topic}. (3 marks)
3. How does ${topic} relate to what you have learned previously in ${subject}? (4 marks)
4. Give two real-world examples where ${topic} is applied. (5 marks)

## Section C: Problem Solving (25 marks)
1. Solve the following problem related to ${topic}: [Problem statement here] (10 marks)
2. Create your own example demonstrating ${topic}. (15 marks)

---
*Total: 50 marks | Time: 45 minutes*`;

    case 'quiz':
      return `# ${subject} Quiz — ${topic}
**Grade:** ${grade} | **Difficulty:** ${diffLabel} | **Total: 20 marks**

---

**Instructions:** Choose the best answer for each question.

**Q1.** Which of the following best describes ${topic}?
- A) Option one related to ${topic}
- B) Option two related to ${topic}
- C) Option three related to ${topic} ✓
- D) Option four related to ${topic}

**Q2.** What is the primary purpose of ${topic} in ${subject}?
- A) To simplify complex problems ✓
- B) To create new problems
- C) To avoid calculations
- D) None of the above

**Q3.** Which example best illustrates ${topic}?
- A) Example A
- B) Example B ✓
- C) Example C
- D) Example D

**Q4.** In Grade ${grade} ${subject}, ${topic} is most commonly used for:
- A) Basic operations
- B) Advanced analysis ✓
- C) Memorization
- D) Estimation only

**Q5.** True or False: ${topic} can be applied across multiple areas of ${subject}.
**Answer: True** ✓

---
*Answer Key: 1-C, 2-A, 3-B, 4-B, 5-True*`;

    case 'lessonPlan':
      return `# Lesson Plan: ${topic}
**Subject:** ${subject} | **Grade:** ${grade} | **Difficulty:** ${diffLabel}
**Duration:** 45 minutes

---

## Learning Objectives
By the end of this lesson, students will be able to:
1. Define and explain the concept of ${topic}
2. Apply ${topic} to solve grade-appropriate problems
3. Connect ${topic} to real-world scenarios
4. Demonstrate understanding through collaborative activities

## Materials Needed
- Whiteboard / Digital board
- Worksheets (prepared in advance)
- Colored markers
- Student notebooks

## Lesson Structure

### 🔔 Warm-Up (5 minutes)
- Review prior knowledge with 2-3 quick questions
- Ask students: "Where have you seen ${topic} in daily life?"
- Brief discussion to activate prior knowledge

### 📖 Introduction (10 minutes)
- Introduce ${topic} with a clear definition
- Use visual aids and real-world examples
- Highlight key vocabulary: [Term 1], [Term 2], [Term 3]

### 🎯 Direct Instruction (15 minutes)
- Demonstrate 2-3 worked examples step-by-step
- Think aloud while solving problems
- Check for understanding with thumbs up/down

### 👥 Guided Practice (10 minutes)
- Students work in pairs on practice problems
- Teacher circulates and provides support
- Address common misconceptions

### ✅ Closure (5 minutes)
- Exit ticket: 1 question on ${topic}
- Preview next lesson
- Assign homework (3-5 practice problems)

## Assessment
- Formative: Observation during guided practice
- Summative: End-of-unit quiz on ${topic}

## Differentiation
- **Support:** Provide graphic organizers and step-by-step guides
- **Extension:** Challenge problems with multi-step applications`;

    case 'questionPaper':
      return `# ${subject} Question Paper
**Grade:** ${grade} | **Topic:** ${topic} | **Difficulty:** ${diffLabel}
**Total Marks: 100 | Time: 2 Hours**

---

## SECTION A — Multiple Choice Questions (20 marks)
*Each question carries 2 marks. Choose the correct option.*

1. Define ${topic} in the context of ${subject}. [2]
2. Which of the following is NOT a characteristic of ${topic}? [2]
3. The relationship between ${topic} and [related concept] is: [2]
4. Calculate/Identify the following related to ${topic}: [2]
5. Which formula/rule applies to ${topic}? [2]
*(Questions 6-10 follow similar pattern)*

## SECTION B — Short Answer Questions (30 marks)
*Answer any 5 questions. Each carries 6 marks.*

1. Explain ${topic} with the help of a diagram. [6]
2. Compare and contrast ${topic} with [related concept]. [6]
3. Solve: [Problem involving ${topic}] [6]
4. List and explain three applications of ${topic}. [6]
5. Describe the historical development of ${topic} in ${subject}. [6]
6. How would you use ${topic} to solve [real-world problem]? [6]

## SECTION C — Long Answer Questions (50 marks)
*Answer any 2 questions. Each carries 25 marks.*

1. (a) Define ${topic} and state its fundamental principles. [10]
   (b) Derive/Prove the main theorem/rule related to ${topic}. [10]
   (c) Apply ${topic} to solve the following comprehensive problem. [5]

2. Write a detailed essay on the significance of ${topic} in modern ${subject},
   including examples, applications, and future implications. [25]

---
*All the best! Read questions carefully before answering.*`;

    case 'rubric':
      return `# Assessment Rubric: ${topic}
**Subject:** ${subject} | **Grade:** ${grade}

---

| Criteria | Excellent (4) | Proficient (3) | Developing (2) | Beginning (1) |
|----------|--------------|----------------|----------------|---------------|
| **Understanding of ${topic}** | Demonstrates thorough, nuanced understanding with no errors | Shows solid understanding with minor gaps | Shows partial understanding with some errors | Shows limited understanding with significant gaps |
| **Application of Concepts** | Applies ${topic} accurately and creatively to novel situations | Applies ${topic} correctly in standard situations | Applies ${topic} with some guidance needed | Struggles to apply ${topic} independently |
| **Problem Solving** | Solves complex problems systematically with clear reasoning | Solves standard problems with clear steps | Solves simple problems with some errors | Attempts problems but makes frequent errors |
| **Communication** | Explains ideas clearly, using precise ${subject} vocabulary | Explains ideas adequately with appropriate vocabulary | Explains ideas with some unclear reasoning | Struggles to communicate mathematical ideas |
| **Accuracy** | All work is accurate and complete | Most work is accurate with minor errors | Some work is accurate; several errors present | Work contains many errors |

## Scoring Guide
- **16-20 points:** Outstanding — Exceeds grade-level expectations
- **12-15 points:** Proficient — Meets grade-level expectations
- **8-11 points:** Developing — Approaching grade-level expectations
- **4-7 points:** Beginning — Below grade-level expectations

*Feedback Notes:*
_______________________________________________`;

    case 'teachingStrategies':
      return `# Teaching Strategies for ${topic}
**Subject:** ${subject} | **Grade:** ${grade} | **Difficulty:** ${diffLabel}

---

## 🎯 Recommended Pedagogical Approaches

### 1. Inquiry-Based Learning
- Pose open-ended questions about ${topic}
- Allow students to explore and discover patterns
- Guide with Socratic questioning rather than direct answers
- **Activity:** "What do you notice about ${topic}? What do you wonder?"

### 2. Visual & Spatial Strategies
- Use diagrams, charts, and graphic organizers for ${topic}
- Color-code key components and relationships
- Create concept maps connecting ${topic} to prior knowledge
- **Tool:** Interactive whiteboard demonstrations

### 3. Collaborative Learning
- Think-Pair-Share activities on ${topic} problems
- Jigsaw method: each group masters one aspect of ${topic}
- Peer teaching reinforces understanding
- **Activity:** Group problem-solving stations

### 4. Real-World Connections
- Connect ${topic} to everyday situations students encounter
- Use current events and news to illustrate ${topic}
- Project-based learning with authentic applications
- **Example:** "How is ${topic} used in [career/daily life]?"

### 5. Differentiated Instruction
- **Visual learners:** Diagrams, videos, graphic organizers
- **Auditory learners:** Discussions, verbal explanations, songs/mnemonics
- **Kinesthetic learners:** Hands-on activities, manipulatives
- **Advanced students:** Extension problems, research projects

### 6. Formative Assessment Strategies
- Exit tickets after each lesson on ${topic}
- Mini whiteboards for quick checks
- Digital polls and quizzes (Kahoot, Mentimeter)
- Observation checklists during activities

## 📚 Recommended Resources
- Textbook chapters on ${topic}
- Online simulations and interactive tools
- Video tutorials (Khan Academy, YouTube EDU)
- Practice worksheets at varying difficulty levels

## ⚠️ Common Misconceptions to Address
1. Students often confuse ${topic} with [related concept]
2. Watch for errors in [specific step/process]
3. Reinforce the difference between [concept A] and [concept B]`;

    default:
      return 'Content generated successfully.';
  }
}
