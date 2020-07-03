import { Pipe } from "rxcomp";
import { getSlug } from "../environment";

export default class SlugPipe extends Pipe {

	static transform(value) {
		return getSlug(value);
	}

}

SlugPipe.meta = {
	name: 'slug',
};
