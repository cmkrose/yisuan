import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { KnowledgeBaseService } from './knowledge-base.service';

@Controller('api/knowledge')
export class KnowledgeBaseController {
  constructor(private readonly svc: KnowledgeBaseService) {}

  @Get('categories')
  categories() { return this.svc.getCategories(); }

  @Get('search')
  search(@Query('q') q: string) { return this.svc.search(q || ''); }

  @Get('category/:name')
  byCategory(@Param('name') name: string) { return this.svc.getByCategory(name); }

  @Get('article/:id')
  article(@Param('id') id: string) { return this.svc.getById(id); }

  @Get('related/:id')
  related(@Param('id') id: string) { return this.svc.getRelated(id); }

  @Get('tags')
  tags() { return this.svc.getPopularTags(); }

  @Get('all')
  all() { return this.svc.search(''); }
}
