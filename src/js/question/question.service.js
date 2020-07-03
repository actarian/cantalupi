import UserService from '../user/user.service';

export class Question {

	constructor(data) {
		if (data) {
			Object.assign(this, data);
			if (this.creationDate) {
				this.creationDate = new Date(this.creationDate);
			}
			if (this.user) {
				this.user = UserService.mapUser(this.user);
			}
		}
	}

}

export default class QuestionService {

	static mapQuestion(question, isStatic) {
		return isStatic ? QuestionService.fake(new Question(question)) : new Question(question);
	}

	static mapQuestions(questions, isStatic) {
		return questions ? questions.map(x => QuestionService.mapQuestion(x, isStatic)) : [];
	}

	static fake(item) {
		const now = new Date();
		const index = item.id % 1000000;
		switch (index) {
			case 4:
				item.creationDate = new Date(new Date().setSeconds(now.getSeconds() - 30));
				break;
			case 3:
				item.creationDate = new Date(new Date().setMinutes(now.getMinutes() - 10));
				break;
			case 2:
				item.creationDate = new Date(new Date().setMinutes(now.getMinutes() - 45));
				break;
			case 1:
				item.creationDate = new Date(new Date().setHours(now.getHours() - 1));
				break;
			default:
				item.creationDate = new Date(new Date().setDate(now.getDate() - 1 - Math.floor(Math.random() * 20)));
		}
		return item;
	}

}
