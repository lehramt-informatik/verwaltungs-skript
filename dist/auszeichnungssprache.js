/**
 * Einfaches Markup (= Auszeichnungssprache) sowohl als HTML als auch als
 * TeX erzeugen.
 */
class Komponente {
}
class Kompositum extends Komponente {
    constructor() {
        super(...arguments);
        this.komponenten_ = [];
    }
    fügeHinzu(komponente) {
        this.komponenten_.push(komponente);
    }
    get komponenten() {
        return this.komponenten_;
    }
    set komponenten(komponenten) {
        if (!Array.isArray(komponenten)) {
            komponenten = [komponenten];
        }
        for (const komponente of komponenten) {
            this.fügeHinzu(komponente);
        }
    }
}
class Kontainer extends Kompositum {
    constructor(text) {
        super();
        this.text = text;
    }
    get auszeichnung() {
        const ausgabe = [];
        if (this.text != null) {
            ausgabe.push(this.text);
        }
        for (const komponente of this.komponenten_) {
            ausgabe.push(komponente.auszeichnung);
        }
        return ausgabe.join('');
    }
}
class Liste extends Kompositum {
    constructor() {
        super(...arguments);
        this.ebene = 1;
    }
    fügeHinzu(komponente) {
        if (komponente instanceof Liste) {
            komponente.ebene = this.ebene + 1;
        }
        this.komponenten_.push(komponente);
    }
}
class Text extends Komponente {
    constructor(text) {
        super();
        this.text = text;
    }
    get auszeichnung() {
        return this.text;
    }
}
class Überschrift extends Komponente {
    constructor(text) {
        super();
        this.text = text;
    }
}
class Link extends Komponente {
    constructor(text, url) {
        super();
        this.text = text;
        this.url = url;
    }
}
class MarkdownListe extends Liste {
    get auszeichnung() {
        const ausgabe = [];
        for (const komponente of this.komponenten_) {
            const einrückung = komponente instanceof MarkdownListe
                ? ''
                : '\n' + ' '.repeat(4 * (this.ebene - 1)) + '- ';
            ausgabe.push(einrückung + komponente.auszeichnung);
        }
        return ausgabe.join('');
    }
}
class MarkdownÜberschrift extends Überschrift {
    get auszeichnung() {
        return '# ' + this.text + '\n';
    }
}
class MarkdownLink extends Link {
    get auszeichnung() {
        return '[' + this.text + '](' + this.url + ')';
    }
}
class TexListe extends Liste {
    get auszeichnung() {
        const ausgabe = [];
        for (const komponente of this.komponenten_) {
            ausgabe.push('\\item ' + komponente.auszeichnung);
        }
        return '\n\\begin{itemize}\n' + ausgabe.join('\n') + '\n\\end{itemize}';
    }
}
class TexÜberschrift extends Überschrift {
    get auszeichnung() {
        return '\\section{' + this.text + '}\n';
    }
}
class TexLink extends Link {
    get auszeichnung() {
        return '\\href{' + this.text + '}{' + this.url + '}';
    }
}
class Fabrik {
    kontainer(text) {
        return new Kontainer(text);
    }
    text(text) {
        return new Text(text);
    }
}
class TexFabrik extends Fabrik {
    liste() {
        return new TexListe();
    }
    überschrift(text) {
        return new TexÜberschrift(text);
    }
    link(text, url) {
        return new TexLink(text, url);
    }
}
class MarkdownFabrik extends Fabrik {
    liste() {
        return new MarkdownListe();
    }
    überschrift(text) {
        return new MarkdownÜberschrift(text);
    }
    link(text, url) {
        return new MarkdownLink(text, url);
    }
}
export function gibAuszeichnung(auszeichnungssprache) {
    if (auszeichnungssprache === 'tex') {
        return new TexFabrik();
    }
    return new MarkdownFabrik();
}
//# sourceMappingURL=auszeichnungssprache.js.map